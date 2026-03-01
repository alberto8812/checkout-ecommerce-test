import { Body, Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Endpoint } from 'src/shared/decorators/endpoint.decorator';
import { ExceptionResponse } from 'src/shared/exceptions/exception-response';
import { PAYMENT_USE_CASE, IPaymentUseCase } from '../../application/interfaces/payment-use-case.interface';
import { CreateCardPaymentDto } from '../../application/dto/create-card-payment.dto';
import { WompiHttpService } from '../services/wompi-http.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(
        @Inject(PAYMENT_USE_CASE) private readonly paymentUseCase: IPaymentUseCase,
        private readonly wompiHttpService: WompiHttpService,
    ) { }

    @Endpoint({
        method: 'POST',
        summary: 'Procesar pago con tarjeta',
        route: 'card',
        responses: [
            { status: 201, description: 'Pago creado', type: Object },
            { status: 400, description: 'Solicitud inválida', type: ExceptionResponse },
        ],
    })
    async createCardPayment(@Body() dto: CreateCardPaymentDto) {
        const result = await this.paymentUseCase.createCardPayment(dto);
        return {
            message: 'Pago recibido, esperando confirmación del banco',
            ...result,
        };
    }

    @Get('status/:wompiTransactionId')
    async getTransactionStatus(@Param('wompiTransactionId') wompiTransactionId: string) {
        const data = await this.wompiHttpService.getTransactionStatus(wompiTransactionId);
        return { id: data.id, status: data.status, reference: data.reference };
    }
}
