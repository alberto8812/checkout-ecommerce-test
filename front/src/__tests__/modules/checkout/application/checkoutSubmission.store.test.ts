import { describe, it, expect, beforeEach } from "vitest";
import { checkoutSubmissionStore } from "@/modules/checkout/application/checkoutSubmission.store";
import type { CheckoutFormValues } from "@/modules/checkout/presentation/constants/checkoutFormConfig";

const mockValues: CheckoutFormValues = {
    cardNumber: "4111 1111 1111 1111",
    cardHolder: "Juan Perez",
    expiry: "12/26",
    cvv: "123",
    fullName: "Juan Perez Garcia",
    email: "juan@example.com",
    address: "Calle 100 #10-20",
    city: "Bogotá",
    postalCode: "110111",
    country: "Colombia",
};

describe("checkoutSubmissionStore", () => {
    // Limpiar estado entre tests consumiendo el snapshot
    beforeEach(() => {
        checkoutSubmissionStore.consume();
    });

    it("peek() retorna null cuando no hay datos guardados", () => {
        expect(checkoutSubmissionStore.peek()).toBeNull();
    });

    it("set() persiste los valores y peek() los retorna sin consumirlos", () => {
        checkoutSubmissionStore.set(mockValues);
        expect(checkoutSubmissionStore.peek()).toEqual(mockValues);
        // peek no consume: puede llamarse dos veces
        expect(checkoutSubmissionStore.peek()).toEqual(mockValues);
    });

    it("consume() retorna el snapshot y lo elimina", () => {
        checkoutSubmissionStore.set(mockValues);
        const result = checkoutSubmissionStore.consume();
        expect(result).toEqual(mockValues);
        expect(checkoutSubmissionStore.peek()).toBeNull();
    });

    it("consume() retorna null si no hay datos", () => {
        expect(checkoutSubmissionStore.consume()).toBeNull();
    });

    it("set() guarda una copia (no la referencia original)", () => {
        checkoutSubmissionStore.set(mockValues);
        const stored = checkoutSubmissionStore.peek();
        expect(stored).not.toBe(mockValues); // distinta referencia
        expect(stored).toEqual(mockValues);  // pero mismo contenido
    });
});
