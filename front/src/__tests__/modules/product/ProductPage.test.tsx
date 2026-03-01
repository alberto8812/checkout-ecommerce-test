import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { ProductPage } from "@/modules/product/presentation/ProductPage";
import { renderWithProviders } from "@/test/utils/render";
import { server } from "@/test/mocks/server";

// Mock de useNavigate para verificar redirección
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("ProductPage", () => {
  it("muestra el spinner mientras carga", () => {
    renderWithProviders(<ProductPage />);
    // El spinner es un Loader2 de lucide o el animate-spin
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("muestra el nombre del producto tras cargar", async () => {
    renderWithProviders(<ProductPage />);
    await waitFor(() => {
      expect(screen.getByText("Sony WH-1000XM5")).toBeInTheDocument();
    });
  });

  it("muestra el precio formateado", async () => {
    renderWithProviders(<ProductPage />);
    await waitFor(() => {
      // El precio 349990 → "349.990" en COP
      expect(screen.getByText("349.990")).toBeInTheDocument();
    });
  });

  it("muestra el badge 'Disponible'", async () => {
    renderWithProviders(<ProductPage />);
    await waitFor(() => {
      expect(screen.getByText("Disponible")).toBeInTheDocument();
    });
  });

  it("muestra los trust badges (Pago seguro, Envío gratis, Garantía 2 años)", async () => {
    renderWithProviders(<ProductPage />);
    await waitFor(() => {
      expect(screen.getByText("Pago seguro")).toBeInTheDocument();
      expect(screen.getByText("Envío gratis")).toBeInTheDocument();
      expect(screen.getByText("Garantía 2 años")).toBeInTheDocument();
    });
  });

  it("navega a /dashboard/checkout al hacer clic en 'Comprar ahora'", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductPage />);
    await waitFor(() => screen.getByText("Sony WH-1000XM5"));

    const btn = screen.getByRole("button", { name: /comprar ahora/i });
    await user.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/checkout");
  });

  it("muestra mensaje de error cuando la API falla", async () => {
    server.use(
      http.get("http://localhost:3000/inventory/products", () => {
        return HttpResponse.error();
      }),
    );
    renderWithProviders(<ProductPage />);
    await waitFor(() => {
      expect(
        screen.getByText(/No se pudo cargar el producto/i),
      ).toBeInTheDocument();
    });
  });
});
