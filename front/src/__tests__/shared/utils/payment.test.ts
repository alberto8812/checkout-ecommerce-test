import { describe, it, expect } from "vitest";
import { validateLuhn } from "@/shared/utils/payment";

describe("validateLuhn", () => {
    it("valida una tarjeta Visa real (número de prueba)", () => {
        // Número de prueba estándar Visa
        expect(validateLuhn("4111111111111111")).toBe(true);
    });

    it("valida una tarjeta Mastercard de prueba", () => {
        expect(validateLuhn("5500005555555559")).toBe(true);
    });

    it("valida con espacios (como los ingresa el usuario)", () => {
        expect(validateLuhn("4111 1111 1111 1111")).toBe(true);
    });

    it("rechaza un número alterado (dígito cambiado)", () => {
        expect(validateLuhn("4111111111111112")).toBe(false);
    });

    it("rechaza número demasiado corto (< 13 dígitos)", () => {
        expect(validateLuhn("411111111111")).toBe(false);
    });

    it("rechaza número demasiado largo (> 19 dígitos)", () => {
        expect(validateLuhn("41111111111111111111")).toBe(false);
    });

    it("rechaza cadena con letras", () => {
        expect(validateLuhn("4111abc111111111")).toBe(false);
    });

    it("rechaza cadena vacía (retorna false)", () => {
        expect(validateLuhn("")).toBe(false);
    });

    it("valida Amex de prueba (15 dígitos)", () => {
        expect(validateLuhn("378282246310005")).toBe(true);
    });
});
