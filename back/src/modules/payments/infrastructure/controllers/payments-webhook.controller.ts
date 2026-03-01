import { Body, Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Endpoint } from 'src/shared/decorators/endpoint.decorator';
import { ExceptionResponse } from 'src/shared/exceptions/exception-response';
import { PAYMENT_USE_CASE, IPaymentUseCase } from '../../application/interfaces/payment-use-case.interface';
import { WompiWebhookDto } from '../../application/dto/wompi-webhook.dto';

@ApiTags('Payments')
@Controller('payments/webhooks')
export class PaymentsWebhookController {
    constructor(@Inject(PAYMENT_USE_CASE) private readonly paymentUseCase: IPaymentUseCase) { }

    @Endpoint({
        method: 'POST',
        summary: 'Webhook de Wompi',
        route: 'wompi',
        responses: [
            { status: 200, description: 'Evento aceptado', type: Object },
            { status: 400, description: 'Payload inválido', type: ExceptionResponse },
        ],
    })
    async handleWompi(@Body() payload: WompiWebhookDto) {
        await this.paymentUseCase.handleWompiWebhook(payload);
        return { received: true };
    }
}
