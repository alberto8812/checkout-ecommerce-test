import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SummarydetailPage } from "@/modules/summarydetail/presentation/Summarydetail.page";
import { renderWithProviders } from "@/test/utils/render";
import type { RootState } from "@/shared/predentation/stores/redux.global.store";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const baseState: Partial<RootState> = {
  ui: {
    step: 3,
    product: {
      id: "prod_001",
      name: "Sony WH-1000XM5",
      description: "Audifonos premium",
      price: 349990,
      base_fee: 5000,
    },
    shipping: {
      fullName: "Ana García",
      email: "ana@example.com",
      address: "Calle 100 #10-20",
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
      status: "idle",
      transactionId: null,
      wompiTransactionId: null,
      reference: null,
      gatewayStatus: null,
      message: null,
      timestamp: null,
    },
  },
};

describe("SummarydetailPage", () => {
  it("muestra el nombre del producto", () => {
    renderWithProviders(<SummarydetailPage />, { preloadedState: baseState });
    expect(screen.getByText("Sony WH-1000XM5")).toBeInTheDocument();
  });

  it("muestra los datos de envío", () => {
    renderWithProviders(<SummarydetailPage />, { preloadedState: baseState });
    expect(screen.getByText("Ana García")).toBeInTheDocument();
    expect(screen.getByText("Calle 100 #10-20")).toBeInTheDocument();
  });

  it("muestra los últimos 4 dígitos de la tarjeta", () => {
    renderWithProviders(<SummarydetailPage />, { preloadedState: baseState });
    expect(
      screen.getByText(/\*\*\*\* \*\*\*\* \*\*\*\* 1111/),
    ).toBeInTheDocument();
  });

  it("muestra la marca de la tarjeta (Visa)", () => {
    renderWithProviders(<SummarydetailPage />, { preloadedState: baseState });
    expect(screen.getByText("Visa")).toBeInTheDocument();
  });

  it("muestra el botón 'Confirmar y pagar'", () => {
    renderWithProviders(<SummarydetailPage />, { preloadedState: baseState });
    expect(
      screen.getByRole("button", { name: /confirmar y pagar/i }),
    ).toBeInTheDocument();
  });

  it("el botón 'Confirmar y pagar' dispara processPayment al hacer clic", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SummarydetailPage />, {
      preloadedState: baseState,
    });

    const btn = screen.getByRole("button", { name: /confirmar y pagar/i });
    await user.click(btn);

    // Después del clic, el estado de payment debe moverse de idle
    await waitFor(() => {
      const state = store.getState().ui.payment;
      // Può essere "processing", "success" o "error" — ya no es "idle"
      expect(state.status).not.toBe("idle");
    });
  });

  it("navega de vuelta a /dashboard/checkout al hacer clic en 'Editar datos'", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SummarydetailPage />, { preloadedState: baseState });

    const backBtn = screen.getByText(/editar datos/i);
    await user.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/checkout");
  });

  it("muestra 'No hay datos de envío' cuando shipping es null", () => {
    const stateNoShipping: Partial<RootState> = {
      ui: {
        ...baseState.ui!,
        shipping: null,
      },
    };
    renderWithProviders(<SummarydetailPage />, {
      preloadedState: stateNoShipping,
    });
    expect(screen.getByText(/no hay datos de envío/i)).toBeInTheDocument();
  });
});
