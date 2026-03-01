import { describe, it, expect } from "vitest";
import { checkoutSchema } from "@/modules/checkout/presentation/schemas/checkout.schema";

const validData = {
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

describe("checkoutSchema (Yup)", () => {
    describe("datos válidos", () => {
        it("pasa con todos los campos correctos", async () => {
            await expect(checkoutSchema.validate(validData)).resolves.toBeTruthy();
        });
    });

    describe("cardNumber", () => {
        it("rechaza tarjeta inválida según Luhn", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, cardNumber: "4111 1111 1111 1112" }),
            ).rejects.toThrow("La tarjeta no es valida");
        });

        it("rechaza formato incorrecto", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, cardNumber: "1234" }),
            ).rejects.toThrow();
        });

        it("rechaza campo vacío", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, cardNumber: "" }),
            ).rejects.toThrow("Ingresa el numero de tu tarjeta");
        });
    });

    describe("expiry", () => {
        it("rechaza formato DD/AA incorrecto", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, expiry: "1/26" }),
            ).rejects.toThrow("Usa el formato MM/AA");
        });

        it("rechaza mes > 12", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, expiry: "13/26" }),
            ).rejects.toThrow("Usa el formato MM/AA");
        });

        it("acepta formato correcto 05/27", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, expiry: "05/27" }),
            ).resolves.toBeTruthy();
        });
    });

    describe("cvv", () => {
        it("rechaza CVV de 2 dígitos", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, cvv: "12" }),
            ).rejects.toThrow("CVV invalido");
        });

        it("acepta CVV de 4 dígitos (Amex)", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, cvv: "1234" }),
            ).resolves.toBeTruthy();
        });
    });

    describe("email", () => {
        it("rechaza email sin @", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, email: "no-es-email" }),
            ).rejects.toThrow("Correo invalido");
        });
    });

    describe("postalCode", () => {
        it("rechaza código postal con letras", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, postalCode: "ABC123" }),
            ).rejects.toThrow("Codigo postal invalido");
        });

        it("rechaza código demasiado corto (< 4 dígitos)", async () => {
            await expect(
                checkoutSchema.validate({ ...validData, postalCode: "123" }),
            ).rejects.toThrow("Codigo postal invalido");
        });
    });
});
