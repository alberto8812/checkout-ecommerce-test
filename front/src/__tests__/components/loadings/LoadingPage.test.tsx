import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingPage from "@/components/loadings/LoadingPage";

describe("LoadingPage", () => {
  it("renderiza el texto 'Cargando'", () => {
    render(<LoadingPage />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("renderiza el texto 'Checkout'", () => {
    render(<LoadingPage />);
    expect(screen.getByText("Checkout")).toBeInTheDocument();
  });

  it("el contenedor principal ocupa la pantalla completa (clase fixed inset-0)", () => {
    const { container } = render(<LoadingPage />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("fixed");
    expect(wrapper).toHaveClass("inset-0");
  });
});
