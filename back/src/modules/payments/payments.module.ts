import { Module } from '@nestjs/common';
import { PaymentsController } from './infrastructure/controllers/payments.controller';
import { PaymentsWebhookController } from './infrastructure/controllers/payments-webhook.controller';
import { PaymentUseCaseService } from './application/use-cases/payment-use-case.service';
import { PAYMENT_USE_CASE } from './application/interfaces/payment-use-case.interface';
import { PAYMENT_REPOSITORY } from './domain/repository/payment.repository.interface';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { WompiHttpService } from './infrastructure/services/wompi-http.service';

@Module({
    imports: [],
    controllers: [PaymentsController, PaymentsWebhookController],
    providers: [
        WompiHttpService,
        {
            provide: PAYMENT_REPOSITORY,
            useClass: PrismaPaymentRepository,
        },
        {
            provide: PAYMENT_USE_CASE,
            useClass: PaymentUseCaseService,
        },
    ],
})
export class PaymentsModule { }
