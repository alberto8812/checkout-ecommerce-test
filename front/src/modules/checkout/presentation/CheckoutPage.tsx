import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AutocompleteField, TextField } from "@/components/forms";
import {
  checkoutFields,
  checkoutSections,
  defaultValues,
  type CheckoutFieldConfig,
} from "./constants/checkoutFormConfig";
import { checkoutSchema } from "./schemas/checkout.schema";
import {
  type WithCheckoutFormInjectedProps,
  withCheckoutForm,
} from "./hoc/withCheckoutForm";
import { cn } from "@/lib/utils";

const product = {
  name: "Sony WH-1000XM5",
  price: 349.99,
  quantity: 1,
  image:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
};

type CheckoutPageProps = WithCheckoutFormInjectedProps;

const CheckoutPageBase = ({
  fields,
  onSubmit,
  isSubmitting,
}: CheckoutPageProps) => {
  const navigate = useNavigate();

  const groupedFields = useMemo(() => {
    return checkoutSections.map((section) => ({
      ...section,
      fields: fields.filter((field) => field.section === section.id),
    }));
  }, [fields]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <button
        type="button"
        onClick={() => navigate("/dashboard/product")}
        className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
      >
        <span className="rounded-full bg-black/5 px-2 py-1 text-xs font-semibold text-black/70">
          ←
        </span>
        Volver al producto
      </button>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr,1fr]">
        <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-black/5">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <p className="text-sm uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Resumen
              </p>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {product.name}
              </h2>
              <p className="text-sm text-[var(--text-tertiary)]">
                Cantidad: {product.quantity}
              </p>
            </div>
            <p className="num text-xl font-semibold">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <div className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="num">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Envio express</span>
              <span className="num">$12.00</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-[var(--text-primary)]">
              <span>Total</span>
              <span className="num">${(product.price + 12).toFixed(2)}</span>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-8">
            {groupedFields.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-lg">{section.icon}</span>
                  <p className="text-sm font-semibold uppercase tracking-[0.08em]">
                    {section.title}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {section.fields.map((field) => (
                    <DynamicField key={field.name} field={field} />
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-3xl bg-black px-6 py-4 text-base font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/40"
            >
              {isSubmitting ? "Procesando..." : "Revisar pedido"}
            </button>
          </form>
        </article>
      </div>
    </section>
  );
};

interface DynamicFieldProps {
  field: CheckoutFieldConfig;
}

const DynamicField = ({ field }: DynamicFieldProps) => {
  if (field.component === "autocomplete") {
    return (
      <AutocompleteField
        name={field.name}
        label={field.label}
        placeholder={field.placeholder}
        options={field.options ?? []}
        containerClass={cn("col-span-1", field.style)}
      />
    );
  }

  return (
    <TextField
      name={field.name}
      label={field.label}
      placeholder={field.placeholder}
      inputMode={field.inputMode}
      type={field.type}
      containerClass={cn("col-span-1", field.style)}
    />
  );
};

export const CheckoutPage = withCheckoutForm(CheckoutPageBase, {
  fields: checkoutFields,
  schema: checkoutSchema,
  defaultValues,
});
