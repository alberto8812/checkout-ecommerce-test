import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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
import { useAppSelector } from "@/shared/predentation/stores/hooks";

type CheckoutPageProps = WithCheckoutFormInjectedProps;

const CheckoutPageBase = ({
  fields,
  onSubmit,
  isSubmitting,
}: CheckoutPageProps) => {
  const navigate = useNavigate();
  const product = useAppSelector((s) => s.ui.product);

  const groupedFields = useMemo(() => {
    return checkoutSections.map((section) => ({
      ...section,
      fields: fields.filter((field) => field.section === section.id),
    }));
  }, [fields]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      {/* ── Back link ── */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/product")}
        className="mb-2 inline-flex items-center gap-1 self-start text-[0.7rem] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft size={11} strokeWidth={2.5} />
        Volver
      </button>

      <form onSubmit={onSubmit}>
        <div className="grid gap-3 sm:grid-cols-5">
          {/* ══════════════ Left column: Order Summary ══════════════ */}
          <div className="sm:col-span-2 sm:self-start">
            <article className="rounded-xl border border-black/5 bg-white p-3 shadow-sm">
              {/* Product row */}
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 overflow-hidden rounded-lg border border-black/5 bg-slate-50">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <h2 className="text-[0.75rem] font-semibold leading-tight text-[var(--text-primary)]">
                    {product.name}
                  </h2>
                  <p className="text-[0.55rem] text-[var(--text-muted)]">
                    Qty: 1
                  </p>
                </div>
                <p className="num text-xs font-semibold text-[var(--text-primary)]">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <hr className="my-2 border-slate-100" />

              {/* Line items */}
              <div className="space-y-0.5 text-[0.65rem] text-[var(--text-secondary)]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="num">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Envío</span>
                  <span className="num">$12.00</span>
                </div>
              </div>

              <hr className="my-2 border-slate-100" />

              {/* Total */}
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                <span>Total</span>
                <span className="num">
                  ${(product.price + 12).toFixed(2)}
                </span>
              </div>

              {/* Security badge */}
              <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-emerald-50/60 py-1 text-[0.5rem] font-medium uppercase tracking-wider text-emerald-700">
                <ShieldCheck size={9} strokeWidth={2.5} />
                Pago seguro
              </div>
            </article>
          </div>

          {/* ══════════════ Right column: Form sections ══════════════ */}
          <div className="flex flex-col gap-3 sm:col-span-3">
            {groupedFields.map((section) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.id}
                  className="rounded-xl border border-black/5 bg-white p-3 shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-1.5 text-[var(--text-secondary)]">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-100">
                      <Icon size={11} strokeWidth={2} />
                    </div>
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.08em]">
                      {section.title}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {section.fields.map((field) => (
                      <DynamicField key={field.name} field={field} />
                    ))}
                  </div>
                </article>
              );
            })}

            {/* ── Submit CTA ── */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-px hover:bg-slate-800 hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.18)] active:translate-y-0 active:opacity-80 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Procesando…
                </>
              ) : (
                "Revisar pedido"
              )}
            </button>
          </div>
        </div>
      </form>
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
