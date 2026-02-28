import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/modules/product/domain/entity/product.interface";


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

/** Luhn algorithm for card number validation */
export function validateLuhn(number: string): boolean {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    let sum = 0;
    let alternate = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let n = parseInt(cleaned[i], 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }
    return sum % 10 === 0;
}

// ─── Async Thunk: Simulate payment gateway ────────────────────────────────────

export const processPayment = createAsyncThunk(
    "checkout/processPayment",
    async (
        _payload: { card: CardInfo; shipping: ShippingInfo; product: Product },
        { rejectWithValue }
    ) => {
        // Simulate tokenization — sensitive data never hits Redux
        const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

        // Simulate API call to payment gateway
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Simulate ~85% success rate for demo
        const isSuccess = Math.random() > 0.15;

        if (!isSuccess) {
            return rejectWithValue({
                message: "Pago rechazado. Verifica los datos de tu tarjeta e intenta nuevamente.",
                transactionId: null,
            });
        }

        return {
            transactionId: `txn_${token}`,
            message: "Pago procesado exitosamente",
            timestamp: new Date().toISOString(),
        };
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(processPayment.pending, (state) => {
                state.payment.status = "processing";
                state.payment.message = null;
                state.payment.transactionId = null;
            })
            .addCase(processPayment.fulfilled, (state, action) => {
                state.payment.status = "success";
                state.payment.transactionId = action.payload.transactionId;
                state.payment.message = action.payload.message;
                state.payment.timestamp = action.payload.timestamp;
                state.step = 4;
            })
            .addCase(processPayment.rejected, (state, action) => {
                state.payment.status = "error";
                const payload = action.payload as { message: string; transactionId: null } | undefined;
                state.payment.message = payload?.message ?? "Error desconocido al procesar el pago.";
                state.step = 4;
            });
    },
});

export const { goToStep, setShipping, setMaskedCard, resetCheckout, setProduct } = checkoutSlice.actions;
export default checkoutSlice.reducer;
