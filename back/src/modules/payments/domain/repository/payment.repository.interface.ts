import { Prisma } from 'generated/prisma/client';

export interface ShippingDetails {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface PreparePaymentInput {
    productId: string;
    quantity: number;
    currency: string;
    deliveryFee: number;
    reference: string;
    shipping: ShippingDetails;
}

export interface PreparedPayment {
    transactionId: string;
    totalAmount: number;
    currency: string;
    reference: string;
    quantity: number;
    unitPrice: number;
    customerEmail: string;
}

export interface AttachGatewayTransactionInput {
    transactionId: string;
    wompiTransactionId: string;
    gatewayStatus: string;
    gatewayPayload: Prisma.InputJsonValue;
}

export interface WebhookUpdateInput {
    wompiTransactionId?: string;
    reference?: string;
    status: string;
    rawEvent: Prisma.InputJsonValue;
    captureInventory: boolean;
    releaseReservation: boolean;
}

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface IPaymentRepository {
    preparePayment(input: PreparePaymentInput): Promise<PreparedPayment>;
    attachGatewayTransaction(input: AttachGatewayTransactionInput): Promise<void>;
    failReservation(transactionId: string): Promise<void>;
    processWebhookUpdate(input: WebhookUpdateInput): Promise<void>;
}
