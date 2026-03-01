import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { AutocompleteField } from "@/components/forms/AutocompleteField";

const mockOptions = [
  { label: "Bogotá", value: "bogota" },
  { label: "Medellín", value: "medellin" },
  { label: "Cali", value: "cali" },
  { label: "Barranquilla", value: "barranquilla" },
  { label: "Cartagena", value: "cartagena" },
  { label: "Bucaramanga", value: "bucaramanga" },
];

function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { city: "" } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("AutocompleteField", () => {
  it("renderiza el label correctamente", () => {
    render(
      <FormWrapper>
        <AutocompleteField name="city" label="Ciudad" options={mockOptions} />
      </FormWrapper>,
    );
    expect(screen.getByText("Ciudad")).toBeInTheDocument();
  });

  it("renderiza el input con el placeholder", () => {
    render(
      <FormWrapper>
        <AutocompleteField
          name="city"
          label="Ciudad"
          placeholder="Selecciona una ciudad"
          options={mockOptions}
        />
      </FormWrapper>,
    );
    expect(
      screen.getByPlaceholderText("Selecciona una ciudad"),
    ).toBeInTheDocument();
  });

  it("muestra opciones al hacer focus en el input", async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <AutocompleteField name="city" label="Ciudad" options={mockOptions} />
      </FormWrapper>,
    );
    const input = screen.getByRole("textbox");
    await user.click(input);
    // Con focus debe mostrar hasta 5 opciones (sin filtro)
    await waitFor(() => {
      expect(screen.getByText("Bogotá")).toBeInTheDocument();
    });
  });

  it("filtra opciones al escribir", async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <AutocompleteField name="city" label="Ciudad" options={mockOptions} />
      </FormWrapper>,
    );
    const input = screen.getByRole("textbox");
    await user.type(input, "mede");
    await waitFor(() => {
      expect(screen.getByText("Medellín")).toBeInTheDocument();
      expect(screen.queryByText("Bogotá")).not.toBeInTheDocument();
    });
  });

  it("renderiza el icono de chevron", () => {
    const { container } = render(
      <FormWrapper>
        <AutocompleteField name="city" label="Ciudad" options={mockOptions} />
      </FormWrapper>,
    );
    // El ChevronDown es un SVG de lucide
    const svgIcons = container.querySelectorAll("svg");
    expect(svgIcons.length).toBeGreaterThan(0);
  });
});
