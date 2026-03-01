import { httpClient } from "@/shared/predentation/http";

export interface PaymentStatusResponse {
    id: string;
    status: string;
    reference: string;
}

export const getPaymentStatus = async (
    wompiTransactionId: string,
): Promise<PaymentStatusResponse> => {
    const response = await httpClient.get<PaymentStatusResponse>(
        `/payments/status/${wompiTransactionId}`,
    );
    return response.data;
};
