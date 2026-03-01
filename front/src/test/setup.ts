import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll, vi } from "vitest";
import { server } from "./mocks/server";

// Arrancar MSW antes de todos los tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Resetear handlers después de cada test
afterEach(() => {
    server.resetHandlers();
    cleanup();
});

// Parar MSW al finalizar todos los tests
afterAll(() => server.close());

// Silenciar console.error en tests
vi.spyOn(console, "error").mockImplementation(() => undefined);
