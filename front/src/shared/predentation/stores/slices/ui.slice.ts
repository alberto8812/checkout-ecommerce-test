import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/modules/product/domain/entity/product.interface";
import { createCardPayment } from "@/modules/checkout/api/create_card_payment";
import { checkoutSubmissionStore } from "@/modules/checkout/application/checkoutSubmission.store";
import { HttpError } from "@/shared/predentation/http";
import type { RootState } from "../redux.global.store";


export interface ShippingInfo {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
}

export interface CardInfo {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
}

/** We only persist the masked version of card data in Redux */
export interface MaskedCardInfo {
    lastFour: string;
    name: string;
    expiry: string;
    brand: string;
}

export type CheckoutStep = 1 | 2 | 3 | 4;

export type PaymentStatus = "idle" | "processing" | "success" | "error";

export interface PaymentResult {
    status: PaymentStatus;
    transactionId: string | null;
    wompiTransactionId: string | null;
    reference: string | null;
    gatewayStatus: string | null;
    message: string | null;
    timestamp: string | null;
}

interface CheckoutState {
    step: CheckoutStep;
    product: Product;
    shipping: ShippingInfo | null;
    maskedCard: MaskedCardInfo | null;
    payment: PaymentResult;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectCardBrand(number: string): string {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "Amex";
    if (/^6(?:011|5)/.test(cleaned)) return "Discover";
    return "Tarjeta";
}

function maskCardNumber(number: string): string {
    const cleaned = number.replace(/\s/g, "");
    return cleaned.slice(-4);
}

// ─── Async Thunk: Simulate payment gateway ────────────────────────────────────

export const processPayment = createAsyncThunk(
    "checkout/processPayment",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const product = state.ui.product;
        const shipping = state.ui.shipping;

        if (!shipping) {
            return rejectWithValue({ message: "No hay datos de envío, vuelve al formulario." });
        }

        const submission = checkoutSubmissionStore.peek();
        if (!submission) {
            return rejectWithValue({ message: "Los datos de la tarjeta expiraron, completa el formulario nuevamente." });
        }

        try {
            const response = await createCardPayment({
                productId: product.id,
                quantity: 1,
                shipping: {
                    fullName: shipping.fullName,
                    email: shipping.email,
                    address: shipping.address,
                    city: shipping.city,
                    postalCode: shipping.zipCode,
                    country: shipping.country,
                },
                card: {
                    number: submission.cardNumber.replace(/\s+/g, ""),
                    cardHolder: submission.cardHolder,
                    expiry: submission.expiry,
                    cvv: submission.cvv,
                    installments: 1,
                },
            });

            checkoutSubmissionStore.consume();

            return {
                transactionId: response.transactionId,
                wompiTransactionId: response.wompiTransactionId,
                reference: response.reference,
                gatewayStatus: response.status,
                message: response.message,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            if (error instanceof HttpError) {
                return rejectWithValue({ message: error.message });
            }
            return rejectWithValue({ message: "No se pudo procesar el pago, intenta nuevamente." });
        }
    }
);

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: CheckoutState = {
    step: 1,
    product: {
        id: "prod_001",
        name: "Sony WH-1000XM5",
        description:
            "Audifonos inalambricos premium con cancelacion de ruido adaptativa, 30 horas de bateria y audio Hi-Res. Diseno ultraligero y plegable con microfono de alta calidad para llamadas cristalinas.",
        price: 349.99,
        base_fee: 0,
    },
    shipping: null,
    maskedCard: null,
    payment: {
        status: "idle",
        transactionId: null,
        wompiTransactionId: null,
        reference: null,
        gatewayStatus: null,
        message: null,
        timestamp: null,
    },
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setProduct(state, action: PayloadAction<Product>) {
            state.product = action.payload;
        },
        goToStep(state, action: PayloadAction<CheckoutStep>) {
            state.step = action.payload;
        },
        setShipping(state, action: PayloadAction<ShippingInfo>) {
            state.shipping = action.payload;
        },
        setMaskedCard(state, action: PayloadAction<CardInfo>) {
            const card = action.payload;
            state.maskedCard = {
                lastFour: maskCardNumber(card.number),
                name: card.name,
                expiry: card.expiry,
                brand: detectCardBrand(card.number),
            };
        },
        resetCheckout(state) {
            state.step = 1;
            state.shipping = null;
            state.maskedCard = null;
            state.payment = { ...initialState.payment };
        },
        updateGatewayStatus(state, action: PayloadAction<string>) {
            state.payment.gatewayStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(processPayment.pending, (state) => {
                state.payment.status = "processing";
                state.payment.message = null;
                state.payment.transactionId = null;
                state.payment.wompiTransactionId = null;
                state.payment.reference = null;
                state.payment.gatewayStatus = null;
                state.payment.timestamp = null;
            })
            .addCase(processPayment.fulfilled, (state, action) => {
                state.payment.status = "success";
                state.payment.transactionId = action.payload.transactionId;
                state.payment.wompiTransactionId = action.payload.wompiTransactionId;
                state.payment.reference = action.payload.reference;
                state.payment.gatewayStatus = action.payload.gatewayStatus;
                state.payment.message = action.payload.message;
                state.payment.timestamp = action.payload.timestamp;
                state.step = 4;
            })
            .addCase(processPayment.rejected, (state, action) => {
                state.payment.status = "error";
                const payload = action.payload as { message: string } | undefined;
                state.payment.message = payload?.message ?? "Error desconocido al procesar el pago.";
                state.payment.gatewayStatus = null;
                state.payment.reference = null;
                state.payment.wompiTransactionId = null;
                state.payment.transactionId = null;
                state.step = 4;
            });
    },
});

export const { goToStep, setShipping, setMaskedCard, resetCheckout, setProduct, updateGatewayStatus } = checkoutSlice.actions;
export default checkoutSlice.reducer;
