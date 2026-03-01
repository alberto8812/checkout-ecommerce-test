import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer, {
    goToStep,
    setProduct,
    setShipping,
    setMaskedCard,
    resetCheckout,
    updateGatewayStatus,
    processPayment,
} from "@/shared/predentation/stores/slices/ui.slice";
import type { ShippingInfo } from "@/shared/predentation/stores/slices/ui.slice";
import type { Product } from "@/modules/product/domain/entity/product.interface";

// Helper: store limpio para cada test
function makeStore() {
    return configureStore({ reducer: { ui: uiReducer } });
}

const mockProduct: Product = {
    id: "prod_test",
    name: "Test Product",
    description: "Test desc",
    price: 200_000,
    base_fee: 3_000,
};

const mockShipping: ShippingInfo = {
    fullName: "Ana García",
    email: "ana@example.com",
    address: "Av. El Dorado 10",
    city: "Bogotá",
    zipCode: "110111",
    country: "Colombia",
};

describe("ui.slice — reducers síncronos", () => {
    it("estado inicial tiene step = 1 y payment.status = 'idle'", () => {
        const store = makeStore();
        const state = store.getState().ui;
        expect(state.step).toBe(1);
        expect(state.payment.status).toBe("idle");
        expect(state.shipping).toBeNull();
        expect(state.maskedCard).toBeNull();
    });

    it("goToStep actualiza el step", () => {
        const store = makeStore();
        store.dispatch(goToStep(3));
        expect(store.getState().ui.step).toBe(3);
    });

    it("setProduct actualiza el producto", () => {
        const store = makeStore();
        store.dispatch(setProduct(mockProduct));
        expect(store.getState().ui.product).toEqual(mockProduct);
    });

    it("setShipping guarda la información de envío", () => {
        const store = makeStore();
        store.dispatch(setShipping(mockShipping));
        expect(store.getState().ui.shipping).toEqual(mockShipping);
    });

    it("setMaskedCard enmascara correctamente el número de tarjeta", () => {
        const store = makeStore();
        store.dispatch(
            setMaskedCard({
                number: "4111111111111111",
                name: "Juan Perez",
                expiry: "12/26",
                cvv: "123",
            }),
        );
        const { maskedCard } = store.getState().ui;
        expect(maskedCard).not.toBeNull();
        expect(maskedCard!.lastFour).toBe("1111");
        expect(maskedCard!.brand).toBe("Visa");
        expect(maskedCard!.name).toBe("Juan Perez");
    });

    it("setMaskedCard detecta Mastercard", () => {
        const store = makeStore();
        store.dispatch(
            setMaskedCard({
                number: "5500005555555559",
                name: "Test User",
                expiry: "06/27",
                cvv: "456",
            }),
        );
        expect(store.getState().ui.maskedCard!.brand).toBe("Mastercard");
    });

    it("updateGatewayStatus actualiza el gatewayStatus en payment", () => {
        const store = makeStore();
        store.dispatch(updateGatewayStatus("APPROVED"));
        expect(store.getState().ui.payment.gatewayStatus).toBe("APPROVED");
    });

    it("resetCheckout vuelve al estado inicial (excepto product)", () => {
        const store = makeStore();
        // Primero poblar state
        store.dispatch(goToStep(4));
        store.dispatch(setShipping(mockShipping));
        store.dispatch(
            setMaskedCard({
                number: "4111111111111111",
                name: "Test",
                expiry: "01/30",
                cvv: "000",
            }),
        );
        // Reset
        store.dispatch(resetCheckout());
        const state = store.getState().ui;
        expect(state.step).toBe(1);
        expect(state.shipping).toBeNull();
        expect(state.maskedCard).toBeNull();
        expect(state.payment.status).toBe("idle");
    });
});

describe("ui.slice — thunk processPayment", () => {
    it("pone payment.status en 'processing' y luego 'error' si no hay shipping", async () => {
        const store = makeStore();
        // Sin shipping en el store
        await store.dispatch(processPayment());
        const state = store.getState().ui;
        expect(state.payment.status).toBe("error");
        expect(state.payment.message).toContain("envío");
    });

    it("pone payment.status en 'success' tras respuesta exitosa de la API", async () => {
        const store = makeStore();
        store.dispatch(setShipping(mockShipping));
        // Inyectar submission store
        const { checkoutSubmissionStore } = await import(
            "@/modules/checkout/application/checkoutSubmission.store"
        );
        checkoutSubmissionStore.set({
            cardNumber: "4111 1111 1111 1111",
            cardHolder: "Juan Perez",
            expiry: "12/26",
            cvv: "123",
            fullName: "Juan Perez Garcia",
            email: "juan@example.com",
            address: "Calle 100",
            city: "Bogotá",
            postalCode: "110111",
            country: "Colombia",
        });

        await store.dispatch(processPayment());
        const state = store.getState().ui;
        expect(state.payment.status).toBe("success");
        expect(state.payment.gatewayStatus).toBe("APPROVED");
        expect(state.step).toBe(4);
    });
});
