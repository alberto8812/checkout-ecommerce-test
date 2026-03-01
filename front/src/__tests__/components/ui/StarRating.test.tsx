import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StarRating } from "@/components/ui/StarRating";

describe("StarRating", () => {
  it("renderiza el número correcto de estrellas (por defecto 5)", () => {
    render(<StarRating rating={3} />);
    // Lucide Star renderiza un SVG; contamos los elementos svg
    const stars = document.querySelectorAll("svg");
    expect(stars).toHaveLength(5);
  });

  it("renderiza el número total personalizado", () => {
    render(<StarRating rating={2} total={10} />);
    const stars = document.querySelectorAll("svg");
    expect(stars).toHaveLength(10);
  });

  it("aplica clase de color relleno a las estrellas activas", () => {
    const { container } = render(<StarRating rating={3} />);
    const filledStars = container.querySelectorAll(".fill-amber-400");
    expect(filledStars).toHaveLength(3);
  });

  it("aplica clase de color vacío a las estrellas inactivas", () => {
    const { container } = render(<StarRating rating={2} />);
    const emptyStars = container.querySelectorAll(".fill-slate-200");
    expect(emptyStars).toHaveLength(3); // 5 total - 2 activas
  });

  it("con rating=0 todas las estrellas están vacías", () => {
    const { container } = render(<StarRating rating={0} />);
    const filledStars = container.querySelectorAll(".fill-amber-400");
    const emptyStars = container.querySelectorAll(".fill-slate-200");
    expect(filledStars).toHaveLength(0);
    expect(emptyStars).toHaveLength(5);
  });

  it("con rating=5 (máximo) todas las estrellas están rellenas", () => {
    const { container } = render(<StarRating rating={5} />);
    const filledStars = container.querySelectorAll(".fill-amber-400");
    expect(filledStars).toHaveLength(5);
  });
});
