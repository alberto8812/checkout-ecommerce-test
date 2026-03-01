import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma-manager.service';
import {
    IPaymentRepository,
    PreparePaymentInput,
    PreparedPayment,
    AttachGatewayTransactionInput,
    WebhookUpdateInput,
} from '../../domain/repository/payment.repository.interface';

const SUCCESS_STATUSES = new Set(['APPROVED', 'CONFIRMED', 'SETTLED']);
const FAILURE_STATUSES = new Set(['DECLINED', 'ERROR', 'VOIDED', 'REJECTED']);
const TAX_RATE = 0.16;

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
    private readonly logger = new Logger(PrismaPaymentRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    async preparePayment(input: PreparePaymentInput): Promise<PreparedPayment> {
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: input.productId },
                include: { stock: true },
            });

            if (!product) {
                throw new NotFoundException(`Producto ${input.productId} no existe`);
            }

            const stockRecord = product.stock.at(0);
            if (!stockRecord) {
                throw new BadRequestException('Producto sin inventario configurado');
            }

            const available = stockRecord.real_stock - stockRecord.reserved_stock;
            if (available < input.quantity) {
                throw new BadRequestException('Inventario insuficiente para completar la orden');
            }

            await tx.stock.update({
                where: { id: stockRecord.id },
                data: {
                    reserved_stock: {
                        increment: input.quantity,
                    },
                },
            });

            const customer = await tx.customer.upsert({
                where: { email: input.shipping.email },
                update: {
                    name: input.shipping.fullName,
                    address: input.shipping.address,
                    city: input.shipping.city,
                    country: input.shipping.country,
                    zip_code: input.shipping.postalCode,
                },
                create: {
                    name: input.shipping.fullName,
                    email: input.shipping.email,
                    phone: null,
                    address: input.shipping.address,
                    city: input.shipping.city,
                    country: input.shipping.country,
                    zip_code: input.shipping.postalCode,
                },
            });

            const unitPrice = product.price + (product.base_fee ?? 0);
            const subtotal = unitPrice * input.quantity;
            const taxes = subtotal * TAX_RATE;
            const totalAmount = subtotal + taxes + input.deliveryFee;

            const transaction = await tx.transaction.create({
                data: {
                    customerId: customer.id,
                    amount: totalAmount,
                    currency: input.currency,
                    status: 'PENDING',
                    reference: input.reference,
                },
            });

            await tx.transactionItem.create({
                data: {
                    transactionId: transaction.id,
                    productId: product.id,
                    quantity: input.quantity,
                    unit_price: unitPrice,
                },
            });

            await tx.delivery.create({
                data: {
                    transactionId: transaction.id,
                    delivery_address: `${input.shipping.address}, ${input.shipping.city}, ${input.shipping.country}`,
                    delivery_fee: input.deliveryFee,
                    status: 'PENDING',
                },
            });

            return {
                transactionId: transaction.id,
                totalAmount,
                currency: input.currency,
                reference: input.reference,
                quantity: input.quantity,
                unitPrice,
                customerEmail: input.shipping.email,
            };
        });
    }

    async attachGatewayTransaction(input: AttachGatewayTransactionInput): Promise<void> {
        await this.prisma.transaction.update({
            where: { id: input.transactionId },
            data: {
                wompi_transaction_id: input.wompiTransactionId,
                status: input.gatewayStatus,
                gateway_payload: input.gatewayPayload,
            },
        });
    }

    async failReservation(transactionId: string): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findUnique({
                where: { id: transactionId },
                include: { items: true },
            });

            if (!transaction) {
                this.logger.warn(`Transacción ${transactionId} no encontrada al revertir reserva`);
                return;
            }

            for (const item of transaction.items) {
                const stockRecord = await tx.stock.findFirst({ where: { productId: item.productId } });
                if (!stockRecord) {
                    continue;
                }
                const reservedDecrease = Math.min(item.quantity, stockRecord.reserved_stock);
                await tx.stock.update({
                    where: { id: stockRecord.id },
                    data: {
                        reserved_stock: {
                            decrement: reservedDecrease,
                        },
                    },
                });
            }

            await tx.transaction.update({
                where: { id: transaction.id },
                data: { status: 'FAILED' },
            });

            await tx.delivery.updateMany({
                where: { transactionId: transaction.id },
                data: { status: 'CANCELLED' },
            });
        });
    }

    async processWebhookUpdate(input: WebhookUpdateInput): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const orConditions = [
                ...(input.wompiTransactionId ? [{ wompi_transaction_id: input.wompiTransactionId }] : []),
                ...(input.reference ? [{ reference: input.reference }] : []),
            ];

            if (!orConditions.length) {
                throw new BadRequestException('Identificador de transacción no proporcionado');
            }

            const transaction = await tx.transaction.findFirst({
                where: { OR: orConditions },
                include: { items: true },
            });

            if (!transaction) {
                throw new NotFoundException('Transacción de webhook no encontrada');
            }

            const previousStatus = transaction.status;

            const updateData: Prisma.TransactionUpdateInput = {
                status: input.status,
                gateway_payload: input.rawEvent,
            };

            if (input.wompiTransactionId && !transaction.wompi_transaction_id) {
                updateData['wompi_transaction_id'] = input.wompiTransactionId;
            }

            await tx.transaction.update({
                where: { id: transaction.id },
                data: updateData,
            });

            if (input.captureInventory && !SUCCESS_STATUSES.has(previousStatus)) {
                for (const item of transaction.items) {
                    const stockRecord = await tx.stock.findFirst({ where: { productId: item.productId } });
                    if (!stockRecord) {
                        continue;
                    }
                    const reservedDecrease = Math.min(item.quantity, stockRecord.reserved_stock);
                    await tx.stock.update({
                        where: { id: stockRecord.id },
                        data: {
                            reserved_stock: { decrement: reservedDecrease },
                            real_stock: { decrement: item.quantity },
                            quantity: { decrement: item.quantity },
                        },
                    });
                }
                await tx.delivery.updateMany({
                    where: { transactionId: transaction.id },
                    data: { status: 'READY' },
                });
            } else if (input.releaseReservation && !FAILURE_STATUSES.has(previousStatus)) {
                for (const item of transaction.items) {
                    const stockRecord = await tx.stock.findFirst({ where: { productId: item.productId } });
                    if (!stockRecord) {
                        continue;
                    }
                    const reservedDecrease = Math.min(item.quantity, stockRecord.reserved_stock);
                    await tx.stock.update({
                        where: { id: stockRecord.id },
                        data: {
                            reserved_stock: { decrement: reservedDecrease },
                        },
                    });
                }
                await tx.delivery.updateMany({
                    where: { transactionId: transaction.id },
                    data: { status: 'CANCELLED' },
                });
            }
        });
    }
}
