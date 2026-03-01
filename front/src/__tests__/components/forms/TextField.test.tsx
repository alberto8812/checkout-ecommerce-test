import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { TextField } from "@/components/forms/TextField";

// Wrapper que provee el FormProvider necesario para react-hook-form
function FormWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("TextField", () => {
  it("renderiza el label correctamente", () => {
    render(
      <FormWrapper>
        <TextField name="email" label="Correo electrónico" />
      </FormWrapper>,
    );
    expect(screen.getByText("Correo electrónico")).toBeInTheDocument();
  });

  it("renderiza el input con el id correcto", () => {
    render(
      <FormWrapper>
        <TextField name="email" label="Correo electrónico" />
      </FormWrapper>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "email");
  });

  it("muestra el placeholder recibido", () => {
    render(
      <FormWrapper>
        <TextField
          name="address"
          label="Dirección"
          placeholder="Ingresa tu dirección"
        />
      </FormWrapper>,
    );
    expect(
      screen.getByPlaceholderText("Ingresa tu dirección"),
    ).toBeInTheDocument();
  });

  it("muestra un hint si se proporciona", () => {
    render(
      <FormWrapper>
        <TextField name="code" label="Código" hint="Solo números" />
      </FormWrapper>,
    );
    expect(screen.getByText("Solo números")).toBeInTheDocument();
  });

  it("el input acepta entrada del usuario", async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <TextField name="fullName" label="Nombre" />
      </FormWrapper>,
    );
    const input = screen.getByRole("textbox");
    await user.type(input, "Carlos");
    expect(input).toHaveValue("Carlos");
  });

  it("no muestra mensaje de error cuando no hay errores", () => {
    render(
      <FormWrapper>
        <TextField name="test" label="Test" />
      </FormWrapper>,
    );
    // No debe haber texto rojo de error
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
