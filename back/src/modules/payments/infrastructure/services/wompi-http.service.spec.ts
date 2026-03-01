import { Test, TestingModule } from '@nestjs/testing';
import { WompiHttpService } from './wompi-http.service';
import { envs } from 'src/config/envs';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { WompiWebhookDto } from '../../application/dto/wompi-webhook.dto';
import * as crypto from 'crypto';

jest.mock('src/config/envs', () => ({
    envs: {
        wompiBaseUrl: 'https://sandbox.wompi.co/v1',
        wompiPublicKey: 'pub_test_123',
        wompiPrivateKey: 'prv_test_123',
        wompiEventsKey: 'events_123',
        wompiIntegrityKey: 'integrity_123',
        wompiAcceptanceTtlMin: 10,
    },
}));

describe('WompiHttpService', () => {
    let service: WompiHttpService;
    let globalFetchMock: jest.Mock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WompiHttpService],
        }).compile();

        service = module.get<WompiHttpService>(WompiHttpService);

        globalFetchMock = jest.fn();
        global.fetch = globalFetchMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAcceptanceToken', () => {
        it('should fetch and return a new acceptance token', async () => {
            globalFetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({
                    data: {
                        presigned_acceptance: {
                            acceptance_token: 'acc_123',
                        },
                    },
                }),
            });

            const token = await service.getAcceptanceToken();

            expect(globalFetchMock).toHaveBeenCalledWith('https://sandbox.wompi.co/v1/merchants/pub_test_123', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer pub_test_123',
                },
            });
            expect(token).toBe('acc_123');
        });

        it('should throw HttpException on API error', async () => {
            globalFetchMock.mockResolvedValue({
                ok: false,
                status: 400,
                text: async () => 'Error msg',
            });

            await expect(service.getAcceptanceToken()).rejects.toThrow(HttpException);
        });

        it('should throw InternalServerErrorException on invalid JSON', async () => {
            globalFetchMock.mockResolvedValue({
                ok: true,
                json: async () => { throw new Error('parse error'); },
            });

            await expect(service.getAcceptanceToken()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('tokenizeCard', () => {
        it('should tokenize card data and return token', async () => {
            globalFetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({
                    data: { id: 'tok_123', status: 'CREATED' },
                }),
            });

            const payload = {
                number: '12345',
                cvc: '123',
                expMonth: '12',
                expYear: '26',
                cardHolder: 'John',
            };

            const result = await service.tokenizeCard(payload);

            expect(globalFetchMock).toHaveBeenCalledWith('https://sandbox.wompi.co/v1/tokens/cards', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer pub_test_123',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: payload.number,
                    cvc: payload.cvc,
                    exp_month: payload.expMonth,
                    exp_year: payload.expYear,
                    card_holder: payload.cardHolder,
                }),
            });
            expect(result).toEqual({ data: { id: 'tok_123', status: 'CREATED' } });
        });
    });

    describe('createTransaction', () => {
        it('should create transaction and return response', async () => {
            globalFetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({
                    data: { id: 'txn_123', status: 'APPROVED', reference: 'REF' },
                }),
            });

            const payload = {
                acceptanceToken: 'acc_123',
                amountInCents: 1000,
                currency: 'COP',
                customerEmail: 'j@e.com',
                reference: 'REF',
                paymentToken: 'tok_123',
                installments: 1,
            };

            const signatureBase = `${payload.reference}${payload.amountInCents}${payload.currency}integrity_123`;
            const expectedSignature = crypto.createHash('sha256').update(signatureBase).digest('hex');

            const result = await service.createTransaction(payload);

            expect(globalFetchMock).toHaveBeenCalledWith('https://sandbox.wompi.co/v1/transactions', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer prv_test_123',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    acceptance_token: payload.acceptanceToken,
                    amount_in_cents: payload.amountInCents,
                    currency: payload.currency,
                    customer_email: payload.customerEmail,
                    reference: payload.reference,
                    signature: expectedSignature,
                    payment_method: {
                        type: 'CARD',
                        token: payload.paymentToken,
                        installments: payload.installments,
                    },
                }),
            });
            expect(result).toEqual({ data: { id: 'txn_123', status: 'APPROVED', reference: 'REF' } });
        });
    });

    describe('verifySignature', () => {
        it('should return false if signature properties are empty', () => {
            const payload = { signature: { properties: [], checksum: '' } } as unknown as WompiWebhookDto;
            const isValid = service.verifySignature(payload);
            expect(isValid).toBe(false);
        });

        it('should verify signature correctly matching SHA-256 hash', () => {
            const payload = {
                data: {
                    transaction: {
                        id: '123',
                        amount_in_cents: 1000,
                    },
                },
                signature: {
                    properties: ['transaction.id', 'transaction.amount_in_cents'],
                    checksum: '',
                },
            } as unknown as WompiWebhookDto;

            const values = ['123', '1000'];
            const signatureBase = `${values.join('~')}~integrity_123`;
            const expectedChecksum = crypto.createHash('sha256').update(signatureBase).digest('hex');

            payload.signature.checksum = expectedChecksum;

            const isValid = service.verifySignature(payload);
            expect(isValid).toBe(true);
        });

        it('should fail verification for incorrect checksum', () => {
            const payload = {
                data: {
                    transaction: {
                        id: '123',
                        amount_in_cents: 1000,
                    },
                },
                signature: {
                    properties: ['transaction.id', 'transaction.amount_in_cents'],
                    checksum: 'wrong_checksum',
                },
            } as unknown as WompiWebhookDto;

            const isValid = service.verifySignature(payload);
            expect(isValid).toBe(false);
        });
    });
});
