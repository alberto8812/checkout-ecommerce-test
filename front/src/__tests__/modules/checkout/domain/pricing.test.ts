import { describe, it, expect } from "vitest";
import {
    computeCheckoutTotals,
    SHIPPING_FEE,
    TAX_RATE,
} from "@/modules/checkout/domain/pricing.config";

describe("computeCheckoutTotals", () => {
    it("calcula correctamente con precio unitario y cantidad 1 (por defecto)", () => {
        const price = 100_000;
        const result = computeCheckoutTotals(price);

        expect(result.subtotal).toBe(100_000);
        expect(result.taxes).toBeCloseTo(16_000);
        expect(result.shipping).toBe(SHIPPING_FEE);
        expect(result.total).toBeCloseTo(100_000 + 16_000 + SHIPPING_FEE);
    });

    it("escala correctamente para cantidad > 1", () => {
        const price = 50_000;
        const qty = 3;
        const result = computeCheckoutTotals(price, qty);

        expect(result.subtotal).toBe(150_000);
        expect(result.taxes).toBeCloseTo(150_000 * TAX_RATE);
        expect(result.shipping).toBe(SHIPPING_FEE);
        expect(result.total).toBeCloseTo(150_000 + 150_000 * TAX_RATE + SHIPPING_FEE);
    });

    it("el shipping siempre es fijo independiente del precio", () => {
        const result1 = computeCheckoutTotals(10_000);
        const result2 = computeCheckoutTotals(5_000_000);
        expect(result1.shipping).toBe(result2.shipping);
    });

    it("retorna total correcto para precio 0", () => {
        const result = computeCheckoutTotals(0);
        expect(result.subtotal).toBe(0);
        expect(result.taxes).toBe(0);
        expect(result.total).toBe(SHIPPING_FEE);
    });
});
