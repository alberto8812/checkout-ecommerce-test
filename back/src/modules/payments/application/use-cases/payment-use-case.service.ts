import { Inject, Injectable, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PAYMENT_REPOSITORY, IPaymentRepository } from '../../domain/repository/payment.repository.interface';
import { IPaymentUseCase, CreateCardPaymentResult } from '../interfaces/payment-use-case.interface';
import { CreateCardPaymentDto } from '../dto/create-card-payment.dto';
import { WompiWebhookDto } from '../dto/wompi-webhook.dto';
import { WompiHttpService } from '../../infrastructure/services/wompi-http.service';
import { Prisma } from 'generated/prisma/client';

const SUCCESS_STATUSES = new Set(['APPROVED', 'CONFIRMED', 'SETTLED']);
const FAILURE_STATUSES = new Set(['DECLINED', 'ERROR', 'VOIDED', 'REJECTED']);
const DEFAULT_CURRENCY = 'COP';
const DEFAULT_DELIVERY_FEE = 15000; // COP — tarifa plana usada en UI y servidor

@Injectable()
export class PaymentUseCaseService implements IPaymentUseCase {
    private readonly logger = new Logger(PaymentUseCaseService.name);

    constructor(
        @Inject(PAYMENT_REPOSITORY)
        private readonly paymentRepository: IPaymentRepository,
        private readonly wompiHttpService: WompiHttpService,
    ) { }

    async createCardPayment(dto: CreateCardPaymentDto): Promise<CreateCardPaymentResult> {
        const quantity = dto.quantity ?? 1;
        const reference = this.buildReference(dto.productId);

        const prepared = await this.paymentRepository.preparePayment({
            productId: dto.productId,
            quantity,
            currency: DEFAULT_CURRENCY,
            deliveryFee: DEFAULT_DELIVERY_FEE,
            reference,
            shipping: {
                fullName: dto.shipping.fullName,
                email: dto.shipping.email,
                address: dto.shipping.address,
                city: dto.shipping.city,
                postalCode: dto.shipping.postalCode,
                country: dto.shipping.country,
            },
        });

        const amountInCents = Math.round(prepared.totalAmount * 100);
        const sanitizedCardNumber = dto.card.number.replace(/\s+/g, '');
        const { expMonth, expYear } = this.parseExpiry(dto.card.expiry);

        if (sanitizedCardNumber.length < 12 || sanitizedCardNumber.length > 19) {
            throw new BadRequestException('Número de tarjeta inválido');
        }

        try {
            const [acceptanceToken, tokenizedCard] = await Promise.all([
                this.wompiHttpService.getAcceptanceToken(),
                this.wompiHttpService.tokenizeCard({
                    number: sanitizedCardNumber,
                    cvc: dto.card.cvv,
                    expMonth,
                    expYear,
                    cardHolder: dto.card.cardHolder,
                }),
            ]);

            const wompiTransaction = await this.wompiHttpService.createTransaction({
                acceptanceToken,
                amountInCents,
                currency: prepared.currency,
                customerEmail: prepared.customerEmail,
                reference: prepared.reference,
                paymentToken: tokenizedCard.data.id,
                installments: dto.card.installments ?? 1,
            });

            await this.paymentRepository.attachGatewayTransaction({
                transactionId: prepared.transactionId,
                wompiTransactionId: wompiTransaction.data.id,
                gatewayStatus: wompiTransaction.data.status,
                gatewayPayload: wompiTransaction as unknown as Prisma.InputJsonValue,
            });

            return {
                transactionId: prepared.transactionId,
                wompiTransactionId: wompiTransaction.data.id,
                status: wompiTransaction.data.status,
                reference: wompiTransaction.data.reference,
                amount: prepared.totalAmount,
                currency: prepared.currency,
            };
        } catch (error) {
            const err = error as Error;
            this.logger.error('Error al procesar el pago con Wompi', err.stack);
            await this.paymentRepository.failReservation(prepared.transactionId);
            throw error;
        }
    }

    async handleWompiWebhook(dto: WompiWebhookDto): Promise<void> {
        const isValidSignature = this.wompiHttpService.verifySignature(dto);
        if (!isValidSignature) {
            throw new ForbiddenException('Firma de webhook inválida');
        }

        const transaction = dto.data.transaction;
        const captureInventory = SUCCESS_STATUSES.has(transaction.status);
        const releaseReservation = FAILURE_STATUSES.has(transaction.status);

        await this.paymentRepository.processWebhookUpdate({
            wompiTransactionId: transaction.id,
            reference: transaction.reference,
            status: transaction.status,
            rawEvent: dto as unknown as Prisma.InputJsonValue,
            captureInventory,
            releaseReservation,
        });
    }

    private parseExpiry(expiry: string): { expMonth: string; expYear: string } {
        const [month, year] = expiry.split('/');
        if (!month || !year) {
            throw new BadRequestException('Fecha de expiración inválida');
        }
        // Wompi exige exactamente 2 dígitos (e.g. "30" no "2030")
        const normalizedYear = year.length === 4 ? year.slice(2) : year.padStart(2, '0');
        return { expMonth: month.padStart(2, '0'), expYear: normalizedYear };
    }

    private buildReference(productId: string): string {
        const randomSuffix = Math.random().toString(36).slice(2, 8).toUpperCase();
        return `CHK-${productId.slice(0, 5).toUpperCase()}-${randomSuffix}-${Date.now()}`;
    }
}
