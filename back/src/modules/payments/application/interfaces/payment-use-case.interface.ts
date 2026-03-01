import { CreateCardPaymentDto } from '../dto/create-card-payment.dto';
import { WompiWebhookDto } from '../dto/wompi-webhook.dto';

export interface CreateCardPaymentResult {
    transactionId: string;
    wompiTransactionId: string;
    status: string;
    reference: string;
    amount: number;
    currency: string;
}

export interface IPaymentUseCase {
    createCardPayment(dto: CreateCardPaymentDto): Promise<CreateCardPaymentResult>;
    handleWompiWebhook(dto: WompiWebhookDto): Promise<void>;
}

export const PAYMENT_USE_CASE = Symbol('PAYMENT_USE_CASE');
