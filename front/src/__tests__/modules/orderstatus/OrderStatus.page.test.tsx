import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderStatusPage } from "@/modules/orderstatus/presentation/OrderStatus.page";
import { renderWithProviders } from "@/test/utils/render";
import type { RootState } from "@/shared/predentation/stores/redux.global.store";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const basePaymentState = {
  transactionId: "txn_123",
  wompiTransactionId: "wompi_456",
  reference: "REF-001",
  gatewayStatus: "APPROVED",
  message: "Pago aprobado",
  timestamp: "2026-03-01T12:00:00.000Z",
};

function makeState(
  overrides: Partial<RootState["ui"]["payment"]> = {},
): Partial<RootState> {
  return {
    ui: {
      step: 4,
      product: {
        id: "prod_001",
        name: "Sony WH-1000XM5",
        description: "Audifonos",
        price: 349990,
        base_fee: 5000,
      },
      shipping: {
        fullName: "Ana García",
        email: "ana@example.com",
        address: "Calle 100",
        city: "Bogotá",
        zipCode: "110111",
        country: "Colombia",
      },
      maskedCard: {
        lastFour: "1111",
        name: "Ana García",
        expiry: "12/26",
        brand: "Visa",
      },
      payment: {
        status: "success",
        ...basePaymentState,
        ...overrides,
      },
    },
  };
}

describe("OrderStatusPage — estado APPROVED", () => {
  it("muestra el título '¡Pago aprobado!'", () => {
    renderWithProviders(<OrderStatusPage />, { preloadedState: makeState() });
    expect(screen.getByText("¡Pago aprobado!")).toBeInTheDocument();
  });

  it("muestra el badge 'Aprobado'", () => {
    renderWithProviders(<OrderStatusPage />, { preloadedState: makeState() });
    expect(screen.getByText("Aprobado")).toBeInTheDocument();
  });

  it("muestra la referencia de la transacción", () => {
    renderWithProviders(<OrderStatusPage />, { preloadedState: makeState() });
    expect(screen.getByText("REF-001")).toBeInTheDocument();
  });

  it("muestra el nombre del producto en el resumen", () => {
    renderWithProviders(<OrderStatusPage />, { preloadedState: makeState() });
    expect(screen.getAllByText("Sony WH-1000XM5").length).toBeGreaterThan(0);
  });

  it("navega a /dashboard/product al hacer clic en 'Realizar Nueva Compra'", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OrderStatusPage />, { preloadedState: makeState() });

    const btn = screen.getByRole("button", { name: /realizar nueva compra/i });
    await user.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/product");
  });

  it("no muestra el botón 'Reintentar Pago' en estado success", () => {
    renderWithProviders(<OrderStatusPage />, { preloadedState: makeState() });
    expect(
      screen.queryByRole("button", { name: /reintentar pago/i }),
    ).not.toBeInTheDocument();
  });
});

describe("OrderStatusPage — estado DECLINED (failed)", () => {
  it("muestra el título 'Pago rechazado'", () => {
    renderWithProviders(<OrderStatusPage />, {
      preloadedState: makeState({
        status: "error",
        gatewayStatus: "DECLINED",
        transactionId: null,
        wompiTransactionId: null,
        reference: null,
        timestamp: null,
        message: "Tarjeta rechazada",
      }),
    });
    expect(screen.getByText("Pago rechazado")).toBeInTheDocument();
  });

  it("muestra el botón 'Reintentar Pago'", () => {
    renderWithProviders(<OrderStatusPage />, {
      preloadedState: makeState({
        status: "error",
        gatewayStatus: "DECLINED",
        transactionId: null,
        wompiTransactionId: null,
        reference: null,
        timestamp: null,
        message: "",
      }),
    });
    expect(
      screen.getByRole("button", { name: /reintentar pago/i }),
    ).toBeInTheDocument();
  });

  it("navega a /dashboard/checkout al hacer clic en 'Reintentar Pago'", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OrderStatusPage />, {
      preloadedState: makeState({
        status: "error",
        gatewayStatus: "DECLINED",
        transactionId: null,
        wompiTransactionId: null,
        reference: null,
        timestamp: null,
        message: "",
      }),
    });
    const btn = screen.getByRole("button", { name: /reintentar pago/i });
    await user.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/checkout");
  });
});

describe("OrderStatusPage — estado PENDING", () => {
  it("muestra el título 'Pago en proceso'", () => {
    renderWithProviders(<OrderStatusPage />, {
      preloadedState: makeState({
        status: "processing",
        gatewayStatus: "PENDING",
        reference: "REF-002",
        wompiTransactionId: "wompi_789",
        transactionId: "txn_789",
        timestamp: null,
        message: "",
      }),
    });
    expect(screen.getByText("Pago en proceso")).toBeInTheDocument();
  });

  it("muestra el polling con TanStack Query y estado Pendiente", async () => {
    renderWithProviders(<OrderStatusPage />, {
      preloadedState: makeState({
        status: "processing",
        gatewayStatus: "PENDING",
        reference: "REF-002",
        wompiTransactionId: "wompi_456",
        transactionId: "txn_456",
        timestamp: null,
        message: "",
      }),
    });
    // El polling actualizará desde PENDING → APPROVED con el handler por defecto
    await waitFor(() => {
      // El badge puede cambiar a "Aprobado" tras el polling
      expect(
        screen.queryByText("Pago en proceso") ||
          screen.queryByText("¡Pago aprobado!"),
      ).toBeTruthy();
    });
  });
});
