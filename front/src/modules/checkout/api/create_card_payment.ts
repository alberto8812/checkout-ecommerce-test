import { httpClient } from "@/shared/predentation/http";

export interface ShippingPayload {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface CardPayload {
    number: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    installments?: number;
}

export interface CreateCardPaymentPayload {
    productId: string;
    quantity: number;
    shipping: ShippingPayload;
    card: CardPayload;
}

export interface CreateCardPaymentResponse {
    transactionId: string;
    wompiTransactionId: string;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    message: string;
}

export const createCardPayment = async (
    payload: CreateCardPaymentPayload,
): Promise<CreateCardPaymentResponse> => {
    const response = await httpClient.post<CreateCardPaymentResponse>("/payments/card", payload);
    return response.data;
};
