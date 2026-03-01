import { describe, it, expect } from "vitest";
import { cn, formatCOP } from "@/lib/utils";

describe("cn (class merge helper)", () => {
    it("combina clases simples", () => {
        expect(cn("a", "b")).toBe("a b");
    });

    it("resuelve conflictos de Tailwind (última clase gana)", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
    });

    it("ignora valores falsy", () => {
        expect(cn("a", false, undefined, null, "b")).toBe("a b");
    });

    it("soporta expresiones condicionales", () => {
        const isActive = true;
        expect(cn("base", isActive && "active")).toBe("base active");
    });

    it("retorna cadena vacía si no se pasan argumentos", () => {
        expect(cn()).toBe("");
    });
});

describe("formatCOP", () => {
    it("formatea millones con puntos", () => {
        expect(formatCOP(1499000)).toBe("1.499.000");
    });

    it("formatea miles con punto", () => {
        expect(formatCOP(15000)).toBe("15.000");
    });

    it("formatea números pequeños sin separador", () => {
        expect(formatCOP(990)).toBe("990");
    });

    it("redondea decimales correctamente", () => {
        expect(formatCOP(349990.9)).toBe("349.991");
    });

    it("formatea cero como '0'", () => {
        expect(formatCOP(0)).toBe("0");
    });
});
