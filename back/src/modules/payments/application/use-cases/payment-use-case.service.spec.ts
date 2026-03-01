import { Test, TestingModule } from '@nestjs/testing';
import { PaymentUseCaseService } from './payment-use-case.service';
import { PAYMENT_REPOSITORY } from '../../domain/repository/payment.repository.interface';
import { WompiHttpService } from '../../infrastructure/services/wompi-http.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateCardPaymentDto } from '../dto/create-card-payment.dto';
import { WompiWebhookDto } from '../dto/wompi-webhook.dto';

describe('PaymentUseCaseService', () => {
    let service: PaymentUseCaseService;

    const mockPaymentRepository = {
        preparePayment: jest.fn(),
        attachGatewayTransaction: jest.fn(),
        failReservation: jest.fn(),
        processWebhookUpdate: jest.fn(),
    };

    const mockWompiHttpService = {
        getAcceptanceToken: jest.fn(),
        tokenizeCard: jest.fn(),
        createTransaction: jest.fn(),
        verifySignature: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentUseCaseService,
                {
                    provide: PAYMENT_REPOSITORY,
                    useValue: mockPaymentRepository,
                },
                {
                    provide: WompiHttpService,
                    useValue: mockWompiHttpService,
                },
            ],
        }).compile();

        service = module.get<PaymentUseCaseService>(PaymentUseCaseService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createCardPayment', () => {
        const validDto: CreateCardPaymentDto = {
            productId: 'prod_123',
            quantity: 1,
            card: {
                number: '4242 4242 4242 4242',
                cvv: '123',
                expiry: '12/26',
                cardHolder: 'Jane Doe',
            },
            shipping: {
                fullName: 'Jane Doe',
                email: 'jane@example.com',
                address: '123 Main St',
                city: 'City',
                postalCode: '12345',
                country: 'US',
            },
        };

        it('should throw BadRequestException if card number is invalid', async () => {
            const dtoWithInvalidCard: CreateCardPaymentDto = {
                ...validDto,
                card: { ...validDto.card, number: '123' },
            };

            mockPaymentRepository.preparePayment.mockResolvedValue({
                transactionId: 'txn_123',
                totalAmount: 100,
                currency: 'COP',
                reference: 'REF123',
                quantity: 1,
                unitPrice: 100,
                customerEmail: 'jane@example.com',
            });

            await expect(service.createCardPayment(dtoWithInvalidCard)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw BadRequestException if expiry is invalid', async () => {
            const dtoWithInvalidExpiry: CreateCardPaymentDto = {
                ...validDto,
                card: { ...validDto.card, expiry: '12' },
            };

            mockPaymentRepository.preparePayment.mockResolvedValue({
                transactionId: 'txn_123',
                totalAmount: 100,
                currency: 'COP',
                reference: 'REF123',
                quantity: 1,
                unitPrice: 100,
                customerEmail: 'jane@example.com',
            });

            await expect(service.createCardPayment(dtoWithInvalidExpiry)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should successfully create card payment', async () => {
            mockPaymentRepository.preparePayment.mockResolvedValue({
                transactionId: 'txn_123',
                totalAmount: 100,
                currency: 'COP',
                reference: 'REF123',
                quantity: 1,
                unitPrice: 100,
                customerEmail: 'jane@example.com',
            });

            mockWompiHttpService.getAcceptanceToken.mockResolvedValue('acc_token_123');
            mockWompiHttpService.tokenizeCard.mockResolvedValue({
                data: { id: 'tok_123', status: 'CREATED' },
            });
            mockWompiHttpService.createTransaction.mockResolvedValue({
                data: { id: 'wompi_txn_123', status: 'APPROVED', reference: 'REF123' },
            });

            mockPaymentRepository.attachGatewayTransaction.mockResolvedValue(undefined);

            const result = await service.createCardPayment(validDto);

            expect(mockPaymentRepository.preparePayment).toHaveBeenCalled();
            expect(mockWompiHttpService.getAcceptanceToken).toHaveBeenCalled();
            expect(mockWompiHttpService.tokenizeCard).toHaveBeenCalled();
            expect(mockWompiHttpService.createTransaction).toHaveBeenCalled();
            expect(mockPaymentRepository.attachGatewayTransaction).toHaveBeenCalled();
            expect(result).toEqual({
                transactionId: 'txn_123',
                wompiTransactionId: 'wompi_txn_123',
                status: 'APPROVED',
                reference: 'REF123',
                amount: 100,
                currency: 'COP',
            });
        });

        it('should fail reservation and rethrow on Wompi error', async () => {
            mockPaymentRepository.preparePayment.mockResolvedValue({
                transactionId: 'txn_123',
                totalAmount: 100,
                currency: 'COP',
                reference: 'REF123',
                quantity: 1,
                unitPrice: 100,
                customerEmail: 'jane@example.com',
            });

            const error = new Error('Wompi Error');
            mockWompiHttpService.getAcceptanceToken.mockRejectedValue(error);

            await expect(service.createCardPayment(validDto)).rejects.toThrow(error);
            expect(mockPaymentRepository.failReservation).toHaveBeenCalledWith('txn_123');
        });
    });

    describe('handleWompiWebhook', () => {
        it('should throw ForbiddenException if signature is invalid', async () => {
            mockWompiHttpService.verifySignature.mockReturnValue(false);
            const payload = { data: { transaction: { status: 'APPROVED' } } } as WompiWebhookDto;

            await expect(service.handleWompiWebhook(payload)).rejects.toThrow(ForbiddenException);
        });

        it('should process webhook update if signature is valid', async () => {
            mockWompiHttpService.verifySignature.mockReturnValue(true);
            const payload = {
                data: {
                    transaction: {
                        id: 'wompi_txn_1',
                        reference: 'ref_1',
                        status: 'APPROVED',
                    },
                },
            } as unknown as WompiWebhookDto;

            mockPaymentRepository.processWebhookUpdate.mockResolvedValue(undefined);

            await service.handleWompiWebhook(payload);

            expect(mockPaymentRepository.processWebhookUpdate).toHaveBeenCalledWith({
                wompiTransactionId: 'wompi_txn_1',
                reference: 'ref_1',
                status: 'APPROVED',
                rawEvent: payload,
                captureInventory: true,
                releaseReservation: false,
            });
        });
    });
});
