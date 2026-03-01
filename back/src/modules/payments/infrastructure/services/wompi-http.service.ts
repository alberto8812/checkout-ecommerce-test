import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { envs } from 'src/config/envs';
import { WompiWebhookDto } from '../../application/dto/wompi-webhook.dto';

interface TokenizeCardPayload {
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    cardHolder: string;
}

interface CreateTransactionPayload {
    acceptanceToken: string;
    amountInCents: number;
    currency: string;
    customerEmail: string;
    reference: string;
    paymentToken: string;
    installments: number;
}

interface TokenizeCardResponse {
    data: {
        id: string;
        status: string;
    };
}

interface WompiTransactionResponse {
    data: {
        id: string;
        status: string;
        reference: string;
    };
}

interface MerchantResponse {
    data: {
        presigned_acceptance: {
            acceptance_token: string;
        };
    };
}

@Injectable()
export class WompiHttpService {
    private readonly logger = new Logger(WompiHttpService.name);
    private readonly baseUrl = envs.wompiBaseUrl.replace(/\/$/, '');

    // El acceptance_token de Wompi es de un solo uso: siempre se pide uno nuevo
    async getAcceptanceToken(): Promise<string> {
        const response = await this.request<MerchantResponse>({
            path: `/merchants/${envs.wompiPublicKey}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${envs.wompiPublicKey}`,
            },
        });

        return response.data.presigned_acceptance.acceptance_token;
    }

    async tokenizeCard(payload: TokenizeCardPayload): Promise<TokenizeCardResponse> {
        return this.request<TokenizeCardResponse>({
            path: '/tokens/cards',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${envs.wompiPublicKey}`,
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
    }

    async createTransaction(payload: CreateTransactionPayload): Promise<WompiTransactionResponse> {
        // Firma de integridad: SHA256(reference + amount_in_cents + currency + integrity_key)
        const signatureBase = `${payload.reference}${payload.amountInCents}${payload.currency}${envs.wompiIntegrityKey}`;
        const integritySignature = createHash('sha256').update(signatureBase).digest('hex');

        return this.request<WompiTransactionResponse>({
            path: '/transactions',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${envs.wompiPrivateKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                acceptance_token: payload.acceptanceToken,
                amount_in_cents: payload.amountInCents,
                currency: payload.currency,
                customer_email: payload.customerEmail,
                reference: payload.reference,
                signature: integritySignature,
                payment_method: {
                    type: 'CARD',
                    token: payload.paymentToken,
                    installments: payload.installments,
                },
            }),
        });
    }

    async getTransactionStatus(wompiTransactionId: string): Promise<{ id: string; status: string; reference: string }> {
        const response = await this.request<WompiTransactionResponse>({
            path: `/transactions/${wompiTransactionId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${envs.wompiPrivateKey}`,
            },
        });
        return response.data;
    }

    verifySignature(payload: WompiWebhookDto): boolean {
        const properties = payload.signature?.properties ?? [];
        if (!properties.length) {
            this.logger.warn('Webhook recibido sin propiedades de firma');
            return false;
        }

        const values = properties.map((property) => this.resolveProperty(payload, property));
        const signatureBase = `${values.join('~')}~${envs.wompiIntegrityKey}`;
        const checksum = createHash('sha256').update(signatureBase).digest('hex');
        return checksum === payload.signature.checksum;
    }

    private resolveProperty(payload: WompiWebhookDto, path: string): string {
        const candidates: unknown[] = [payload, payload.data];
        for (const candidate of candidates) {
            const value = this.walkPath(candidate, path);
            if (value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    return JSON.stringify(value);
                }
                return String(value);
            }
        }
        return '';
    }

    private walkPath(source: unknown, path: string): unknown {
        if (!source || typeof source !== 'object') {
            return undefined;
        }
        const segments = path.split('.');
        let current: unknown = source;

        for (const segment of segments) {
            if (current && typeof current === 'object' && segment in (current as Record<string, unknown>)) {
                current = (current as Record<string, unknown>)[segment];
            } else {
                return undefined;
            }
        }
        return current;
    }

    private async request<T>({ path, method, headers, body }: { path: string; method: string; headers?: Record<string, string>; body?: string }): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
            method,
            headers,
            body,
        });

        if (!response.ok) {
            const errorPayload = await this.safeReadBody(response);
            this.logger.error(`Error al invocar Wompi ${response.status} -> ${errorPayload}`);
            throw new HttpException('Error al comunicarse con Wompi', response.status);
        }

        try {
            return (await response.json()) as T;
        } catch (error) {
            this.logger.error(`No se pudo parsear respuesta de Wompi: ${(error as Error).message}`);
            throw new InternalServerErrorException('Respuesta inválida desde Wompi');
        }
    }

    private async safeReadBody(response: any): Promise<string> {
        try {
            return await response.text();
        } catch (error) {
            this.logger.error(`No se pudo leer body de Wompi: ${(error as Error).message}`);
            return '';
        }
    }
}
