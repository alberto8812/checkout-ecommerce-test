import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  CreditCard,
  Lock,
} from "lucide-react";
import { useAppSelector } from "@/shared/predentation/stores/hooks";
import { useAppDispatch } from "@/shared/predentation/stores/hooks";
import {
  processPayment,
  type PaymentStatus,
} from "@/shared/predentation/stores/slices/ui.slice";

/** Detect a simple brand badge color */
const brandConfig: Record<string, { bg: string; text: string }> = {
  Visa: { bg: "bg-[#1a1f71]", text: "text-white" },
  Mastercard: { bg: "bg-[#eb001b]", text: "text-white" },
  Amex: { bg: "bg-[#016fd0]", text: "text-white" },
  Discover: { bg: "bg-[#ff6000]", text: "text-white" },
  Tarjeta: { bg: "bg-slate-800", text: "text-white" },
};

export const SummarydetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = useAppSelector((s) => s.ui.product);
  const shipping = useAppSelector((s) => s.ui.shipping);
  const card = useAppSelector((s) => s.ui.maskedCard);
  const paymentStatus = useAppSelector(
    (s) => s.ui.payment.status,
  ) as PaymentStatus;

  const isProcessing = paymentStatus === "processing";

  // Price calculations
  const subtotal = product.price;
  const shippingCost = 0; // Gratis
  const iva = +(subtotal * 0.16).toFixed(2);
  const total = +(subtotal + shippingCost + iva).toFixed(2);

  const brand = brandConfig[card?.brand ?? "Tarjeta"] ?? brandConfig.Tarjeta;

  const handleConfirm = () => {
    if (!shipping || !card) return;
    dispatch(
      processPayment({
        card: {
          number: `****${card.lastFour}`,
          name: card.name,
          expiry: card.expiry,
          cvv: "***",
        },
        shipping,
        product,
      }),
    );
  };

  return (
    <section className="mx-auto w-full max-w-lg px-4 sm:px-6">
      {/* ── Back ── */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/checkout")}
        className="mb-3 inline-flex items-center gap-1 text-[0.7rem] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft size={11} strokeWidth={2.5} />
        Editar datos
      </button>

      {/* ── Product row ── */}
      <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3 shadow-sm">
        <div className="h-11 w-11 overflow-hidden rounded-lg border border-black/5 bg-slate-50">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-[0.8rem] font-semibold leading-tight text-[var(--text-primary)]">
            {product.name}
          </h2>
          <p className="text-[0.6rem] text-[var(--text-muted)]">Cantidad: 1</p>
        </div>
        <p className="num text-sm font-semibold text-[var(--text-primary)]">
          ${subtotal.toFixed(2)}
        </p>
      </div>

      {/* ── Shipping address ── */}
      <article className="mt-3 rounded-xl border border-black/5 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5 text-[var(--text-secondary)]">
          <MapPin size={12} strokeWidth={2} />
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.08em]">
            Dirección de envío
          </p>
        </div>
        {shipping ? (
          <div className="space-y-0.5 text-[0.8rem] leading-relaxed text-[var(--text-primary)]">
            <p className="font-medium">{shipping.fullName}</p>
            <p>{shipping.address}</p>
            <p>
              {shipping.city}, {shipping.zipCode}
            </p>
            <p>{shipping.country}</p>
            <p className="text-[var(--text-secondary)]">{shipping.email}</p>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">
            No hay datos de envío
          </p>
        )}
      </article>

      {/* ── Payment method ── */}
      <article className="mt-3 rounded-xl border border-black/5 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5 text-[var(--text-secondary)]">
          <CreditCard size={12} strokeWidth={2} />
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.08em]">
            Método de pago
          </p>
        </div>
        {card ? (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-14 items-center justify-center rounded-lg ${brand.bg} ${brand.text} text-[0.65rem] font-bold tracking-wide shadow-sm`}
            >
              {card.brand}
            </div>
            <div>
              <p className="text-[0.8rem] font-medium text-[var(--text-primary)]">
                **** **** **** {card.lastFour}
              </p>
              <p className="text-[0.65rem] text-[var(--text-secondary)]">
                Exp. {card.expiry} · {card.name}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">
            No hay datos de tarjeta
          </p>
        )}
      </article>

      {/* ── Price breakdown ── */}
      <article className="mt-3 rounded-xl border border-black/5 bg-white p-3 shadow-sm">
        <div className="space-y-1.5 text-[0.8rem] text-[var(--text-secondary)]">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="num">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Envío</span>
            <span className="font-medium text-emerald-600">Gratis</span>
          </div>
          <div className="flex items-center justify-between">
            <span>IVA (16%)</span>
            <span className="num">${iva.toFixed(2)}</span>
          </div>
        </div>

        <hr className="my-2.5 border-slate-100" />

        <div className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
          <span>Total</span>
          <span className="num text-base">${total.toFixed(2)}</span>
        </div>
      </article>

      {/* ── Security ── */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[0.55rem] font-medium text-[var(--text-muted)]">
        <ShieldCheck size={10} strokeWidth={2} />
        <span>Transacción protegida con cifrado SSL de 256 bits</span>
      </div>

      {/* ── CTA ── */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isProcessing || !shipping || !card}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-px hover:bg-slate-800 hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.18)] active:translate-y-0 active:opacity-80 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {isProcessing ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Procesando pago…
          </>
        ) : (
          <>
            <Lock size={13} strokeWidth={2.5} />
            Confirmar y pagar ${total.toFixed(2)}
          </>
        )}
      </button>
    </section>
  );
};