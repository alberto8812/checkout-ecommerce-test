import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsWebhookController } from './payments-webhook.controller';
import { PAYMENT_USE_CASE } from '../../application/interfaces/payment-use-case.interface';
import { WompiWebhookDto } from '../../application/dto/wompi-webhook.dto';

describe('PaymentsWebhookController', () => {
    let controller: PaymentsWebhookController;

    const mockPaymentUseCase = {
        handleWompiWebhook: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentsWebhookController],
            providers: [
                {
                    provide: PAYMENT_USE_CASE,
                    useValue: mockPaymentUseCase,
                },
            ],
        }).compile();

        controller = module.get<PaymentsWebhookController>(PaymentsWebhookController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('handleWompi', () => {
        it('should process webhook payload and return { received: true }', async () => {
            const payload = new WompiWebhookDto();

            mockPaymentUseCase.handleWompiWebhook.mockResolvedValue(undefined);

            const result = await controller.handleWompi(payload);

            expect(mockPaymentUseCase.handleWompiWebhook).toHaveBeenCalledWith(payload);
            expect(result).toEqual({ received: true });
        });
    });
});
