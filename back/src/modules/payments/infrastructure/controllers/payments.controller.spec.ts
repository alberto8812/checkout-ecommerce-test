import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PAYMENT_USE_CASE } from '../../application/interfaces/payment-use-case.interface';
import { CreateCardPaymentDto } from '../../application/dto/create-card-payment.dto';
import { WompiHttpService } from '../services/wompi-http.service';

describe('PaymentsController', () => {
    let controller: PaymentsController;

    const mockPaymentUseCase = {
        createCardPayment: jest.fn(),
        handleWompiWebhook: jest.fn(),
    };

    const mockWompiHttpService = {
        getTransactionStatus: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [
                {
                    provide: PAYMENT_USE_CASE,
                    useValue: mockPaymentUseCase,
                },
                {
                    provide: WompiHttpService,
                    useValue: mockWompiHttpService,
                },
            ],
        }).compile();

        controller = module.get<PaymentsController>(PaymentsController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createCardPayment', () => {
        it('should create a card payment and return result', async () => {
            const dto = new CreateCardPaymentDto();
            const expectedResult = {
                transactionId: 'txn_1',
                wompiTransactionId: 'wompi_1',
                status: 'PENDING',
                reference: 'REF1',
                amount: 100,
                currency: 'COP',
            };

            mockPaymentUseCase.createCardPayment.mockResolvedValue(expectedResult);

            const result = await controller.createCardPayment(dto);

            expect(mockPaymentUseCase.createCardPayment).toHaveBeenCalledWith(dto);
            expect(result).toEqual({
                message: 'Pago recibido, esperando confirmación del banco',
                ...expectedResult,
            });
        });
    });

    describe('getTransactionStatus', () => {
        it('should get transaction status from Wompi', async () => {
            const expectedData = { id: 'wompi_123', status: 'APPROVED', reference: 'REF' };
            mockWompiHttpService.getTransactionStatus.mockResolvedValue(expectedData);

            const result = await controller.getTransactionStatus('wompi_123');

            expect(mockWompiHttpService.getTransactionStatus).toHaveBeenCalledWith('wompi_123');
            expect(result).toEqual({ id: 'wompi_123', status: 'APPROVED', reference: 'REF' });
        });
    });
});
