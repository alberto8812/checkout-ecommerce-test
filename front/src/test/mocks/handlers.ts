import { http, HttpResponse } from "msw";

const BASE_URL = "http://localhost:3000";

export const handlers = [
    // Productos
    http.get(`${BASE_URL}/inventory/products`, () => {
        return HttpResponse.json([
            {
                id: "prod_001",
                name: "Sony WH-1000XM5",
                description: "Audifonos inalambricos premium con cancelacion de ruido.",
                price: 349990,
                base_fee: 5000,
                image: null,
            },
        ]);
    }),

    // Crear pago con tarjeta
    http.post(`${BASE_URL}/payments/card`, () => {
        return HttpResponse.json({
            transactionId: "txn_123",
            wompiTransactionId: "wompi_456",
            status: "APPROVED",
            reference: "REF-001",
            amount: 420388,
            currency: "COP",
            message: "Pago aprobado",
        });
    }),

    // Estado del pago
    http.get(`${BASE_URL}/payments/status/:id`, ({ params }) => {
        return HttpResponse.json({
            id: params.id as string,
            status: "APPROVED",
            reference: "REF-001",
        });
    }),
];
