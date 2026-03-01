import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  MapPin,
  CreditCard,
  RotateCcw,
  ShoppingBag,
  Copy,
  Receipt,
} from "lucide-react";
import {
  useAppSelector,
  useAppDispatch,
} from "@/shared/predentation/stores/hooks";
import {
  resetCheckout,
  updateGatewayStatus,
} from "@/shared/predentation/stores/slices/ui.slice";
import { getPaymentStatus } from "../api/get_payment_status";
import { computeCheckoutTotals } from "@/modules/checkout/domain/pricing.config";
import { formatCOP } from "@/lib/utils";

// ─── Tipos de estado ─────────────────────────────────────────────────────────

type GatewayStatus =
  | "APPROVED"
  | "CONFIRMED"
  | "SETTLED"
  | "PENDING"
  | "IN_PROCESS"
  | "DECLINED"
  | "ERROR"
  | "VOIDED"
  | "REJECTED"
  | null;

type OrderState = "success" | "pending" | "failed";

const SUCCESS_STATUSES = new Set(["APPROVED", "CONFIRMED", "SETTLED"]);
const FAILURE_STATUSES = new Set(["DECLINED", "ERROR", "VOIDED", "REJECTED"]);

function resolveOrderState(
  paymentStatus: string,
  gatewayStatus: GatewayStatus,
): OrderState {
  if (paymentStatus === "error") return "failed";
  if (gatewayStatus && SUCCESS_STATUSES.has(gatewayStatus)) return "success";
  if (gatewayStatus && FAILURE_STATUSES.has(gatewayStatus)) return "failed";
  return "pending";
}

// ─── Config visual por estado ────────────────────────────────────────────────

const stateConfig: Record<
  OrderState,
  {
    icon: React.FC<{ size: number; strokeWidth: number; className: string }>;
    bg: string;
    iconClass: string;
    badge: string;
    title: string;
    subtitle: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-900 border-emerald-800 shadow-[0_4px_20px_-4px_rgba(6,95,70,0.3)]",
    iconClass: "text-emerald-400",
    badge: "bg-emerald-800/80 text-emerald-300 border border-emerald-700/50",
    title: "¡Pago aprobado!",
    subtitle:
      "Tu orden ha sido procesada exitosamente. Recibirás un correo con la confirmación.",
  },
  pending: {
    icon: Clock,
    bg: "bg-slate-900 border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.3)]",
    iconClass: "text-amber-400",
    badge: "bg-slate-800/80 text-amber-300 border border-slate-700/50",
    title: "Pago en proceso",
    subtitle:
      "Tu banco está verificando el pago. Esto puede tomar unos minutos, no cierres esta ventana.",
  },
  failed: {
    icon: XCircle,
    bg: "bg-rose-900 border-rose-800 shadow-[0_4px_20px_-4px_rgba(159,18,57,0.3)]",
    iconClass: "text-rose-400",
    badge: "bg-rose-800/80 text-rose-300 border border-rose-700/50",
    title: "Pago rechazado",
    subtitle:
      "No pudimos procesar tu pago. Revisa los datos de tu tarjeta e intenta de nuevo.",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const gatewayStatusLabel: Record<string, string> = {
  APPROVED: "Aprobado",
  CONFIRMED: "Confirmado",
  SETTLED: "Liquidado",
  PENDING: "Pendiente",
  IN_PROCESS: "En proceso",
  DECLINED: "Rechazado",
  ERROR: "Error",
  VOIDED: "Anulado",
  REJECTED: "Rechazado",
};

function formatTimestamp(ts: string | null): string {
  if (!ts) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts));
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // silent
  }
}

/** Detect a simple brand badge color */
const brandConfig: Record<string, { bg: string; text: string }> = {
  Visa: { bg: "bg-[#1a1f71]", text: "text-white" },
  Mastercard: { bg: "bg-[#eb001b]", text: "text-white" },
  Amex: { bg: "bg-[#016fd0]", text: "text-white" },
  Discover: { bg: "bg-[#ff6000]", text: "text-white" },
  Tarjeta: { bg: "bg-slate-800", text: "text-white" },
};

// ─── Componente ──────────────────────────────────────────────────────────────

export const OrderStatusPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const product = useAppSelector((s) => s.ui.product);
  const shipping = useAppSelector((s) => s.ui.shipping);
  const card = useAppSelector((s) => s.ui.maskedCard);
  const payment = useAppSelector((s) => s.ui.payment);

  const FINAL_STATUSES = new Set([
    "APPROVED",
    "CONFIRMED",
    "SETTLED",
    "DECLINED",
    "ERROR",
    "VOIDED",
    "REJECTED",
  ]);
  const isFinalStatus = (s: string | null | undefined) =>
    !!s && FINAL_STATUSES.has(s);

  // ─── Polling con TanStack Query ────────────────────────────────────────
  const { data: polledStatus, isFetching } = useQuery({
    queryKey: ["payment-status", payment.wompiTransactionId],
    queryFn: () => getPaymentStatus(payment.wompiTransactionId!),
    // Solo activo si hay ID y el estado aún no es final
    enabled:
      !!payment.wompiTransactionId && !isFinalStatus(payment.gatewayStatus),
    // Sigue refrescando cada 3s mientras no haya estado final; detiene solo cuando lo tiene
    refetchInterval: (query) =>
      isFinalStatus(query.state.data?.status) ? false : 3000,
    retry: 2,
  });

  // Cuando llegue un estado final, actualiza Redux y detiene el polling
  useEffect(() => {
    if (polledStatus && isFinalStatus(polledStatus.status)) {
      dispatch(updateGatewayStatus(polledStatus.status));
    }
  }, [polledStatus?.status, dispatch, polledStatus]);

  const isPolling = isFetching && !isFinalStatus(payment.gatewayStatus);

  const orderState = useMemo(
    () =>
      resolveOrderState(payment.status, payment.gatewayStatus as GatewayStatus),
    [payment.status, payment.gatewayStatus],
  );

  const {
    subtotal,
    taxes,
    shipping: shippingFee,
    total,
  } = useMemo(() => computeCheckoutTotals(product.price), [product.price]);

  const config = stateConfig[orderState];
  const Icon = config.icon;
  const brand = brandConfig[card?.brand ?? "Tarjeta"] ?? brandConfig.Tarjeta;

  const handleNewPurchase = () => {
    dispatch(resetCheckout());
    navigate("/dashboard/product");
  };

  const handleRetry = () => {
    navigate("/dashboard/checkout");
  };

  return (
    <section className="mx-auto w-full max-w-2xl px-4 sm:px-6 pb-6">
      {/* ── Estado visual ── */}
      <div
        className={`mt-2 mb-4 rounded-xl border ${config.bg} p-5 flex flex-col items-center text-center relative overflow-hidden`}
      >
        <div className="mb-2 relative">
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
          <Icon
            size={40}
            strokeWidth={2}
            className={`relative z-10 ${config.iconClass}`}
          />
        </div>
        <h1 className="text-[1.05rem] font-bold text-white leading-tight tracking-[0.01em]">
          {config.title}
        </h1>
        <p className="mt-1 text-[0.7rem] text-slate-300 max-w-sm leading-relaxed">
          {config.subtitle}
        </p>

        {/* Badge estado gateway */}
        {payment.gatewayStatus && (
          <span
            className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.06em] ${config.badge}`}
          >
            {gatewayStatusLabel[payment.gatewayStatus] ?? payment.gatewayStatus}
          </span>
        )}

        {/* Indicador de polling activo */}
        {isPolling && (
          <div className="mt-4 flex items-center justify-center gap-2 text-[0.65rem] font-medium text-amber-300/90 bg-slate-950/40 px-3.5 py-1.5 rounded-full border border-white/5 shadow-inner">
            <span className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-amber-400/80 border-t-transparent" />
            <span>Verificando con el banco…</span>
          </div>
        )}
      </div>

      {/* ── Grid Layout de Detalles ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Columna Izquierda: Pedido */}
        <div className="space-y-3">
          <article className="rounded-xl border border-black/5 bg-white p-4 shadow-sm h-full flex flex-col">
            <div className="mb-3 flex items-center gap-1.5 text-[var(--text-secondary)]">
              <Package size={12} strokeWidth={2.5} />
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                Resumen del Pedido
              </p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 overflow-hidden rounded-lg border border-black/5 bg-slate-50 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.75rem] font-semibold leading-tight text-[var(--text-primary)] truncate">
                  {product.name}
                </p>
                <p className="text-[0.65rem] text-[var(--text-muted)] mt-0.5 font-medium">
                  Cant: 1
                </p>
              </div>
              <p className="num text-xs font-bold text-[var(--text-primary)] shrink-0">
                ${formatCOP(subtotal)}
              </p>
            </div>

            <div className="space-y-1.5 text-[0.65rem] text-[var(--text-secondary)] border-t border-slate-100 pt-3 flex-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="num text-[var(--text-primary)] font-medium">
                  ${formatCOP(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>IVA (16%)</span>
                <span className="num text-[var(--text-primary)] font-medium">
                  ${formatCOP(taxes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="num text-[var(--text-primary)] font-medium">
                  ${formatCOP(shippingFee)}
                </span>
              </div>
            </div>

            <div className="flex justify-between mt-3 pt-3 border-t border-slate-100 text-sm font-black text-slate-900">
              <span className="uppercase tracking-[0.08em] text-[0.65rem] self-end mb-[1px] text-slate-500 font-bold">
                Total a Pagar
              </span>
              <span className="num text-[0.9rem]">${formatCOP(total)}</span>
            </div>
          </article>
        </div>

        {/* Columna Derecha: Transacción, Envío y Pago */}
        <div className="space-y-3 flex flex-col">
          {/* ── Detalles de la transacción ── */}
          {(payment.reference ||
            payment.wompiTransactionId ||
            payment.timestamp) && (
            <article className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Receipt size={12} strokeWidth={2.5} />
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                  Transacción
                </p>
              </div>
              <div className="space-y-2.5">
                {payment.reference && (
                  <InfoRow
                    label="Referencia"
                    value={payment.reference}
                    copyable
                  />
                )}
                {payment.wompiTransactionId && (
                  <InfoRow
                    label="ID Wompi"
                    value={payment.wompiTransactionId}
                    copyable
                  />
                )}
                {payment.timestamp && (
                  <InfoRow
                    label="Fecha"
                    value={formatTimestamp(payment.timestamp)}
                  />
                )}
              </div>
            </article>
          )}

          <div className="grid grid-cols-2 gap-3 flex-1 items-stretch">
            {/* ── Dirección de envío ── */}
            {shipping && (
              <article className="rounded-xl border border-black/5 bg-white p-3.5 shadow-sm overflow-hidden flex flex-col">
                <div className="mb-2 flex items-center gap-1.5 text-[var(--text-secondary)] shrink-0">
                  <MapPin size={11} strokeWidth={2.5} />
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                    Envío a
                  </p>
                </div>
                <div className="text-[0.65rem] leading-[1.35] text-[var(--text-secondary)] flex-1">
                  <p className="font-bold text-slate-900 mb-1 truncate">
                    {shipping.fullName}
                  </p>
                  <p className="truncate">{shipping.address}</p>
                  <p className="truncate">
                    {shipping.city}, {shipping.zipCode}
                  </p>
                  <p className="truncate">{shipping.country}</p>
                  <p className="mt-1 truncate opacity-80">{shipping.email}</p>
                </div>
              </article>
            )}

            {/* ── Método de pago ── */}
            {card && (
              <article className="rounded-xl border border-black/5 bg-white p-3.5 shadow-sm flex flex-col">
                <div className="mb-2 flex items-center gap-1.5 text-[var(--text-secondary)] shrink-0">
                  <CreditCard size={11} strokeWidth={2.5} />
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                    Pago
                  </p>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`flex h-[22px] px-2 items-center justify-center rounded shadow-sm shrink-0 ${brand.bg} ${brand.text} text-[0.55rem] font-black tracking-wider uppercase`}
                    >
                      {card.brand}
                    </div>
                  </div>
                  <p className="text-[0.7rem] font-bold text-slate-900 tracking-widest num">
                    •••• {card.lastFour}
                  </p>
                  <p className="text-[0.6rem] font-medium text-slate-500 mt-0.5 truncate uppercase tracking-wide">
                    {card.name}
                  </p>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>

      {/* ── CTAs ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {orderState === "failed" && (
          <button
            type="button"
            onClick={handleRetry}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(15,23,42,0.15)] transition-all hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(15,23,42,0.2)] hover:bg-slate-800 active:translate-y-0 active:scale-[0.98]"
          >
            <RotateCcw size={14} strokeWidth={2.5} />
            Reintentar Pago
          </button>
        )}
        <button
          type="button"
          onClick={handleNewPurchase}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-all
            ${
              orderState === "failed"
                ? "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
                : "bg-slate-900 text-white shadow-[0_2px_10px_rgba(15,23,42,0.15)] hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(15,23,42,0.2)] hover:bg-slate-800 active:translate-y-0 active:scale-[0.98]"
            }`}
        >
          <ShoppingBag size={14} strokeWidth={2.5} />
          {orderState === "failed"
            ? "Volver a la Tienda"
            : "Realizar Nueva Compra"}
        </button>
      </div>
    </section>
  );
};

// ─── Subcomponente ────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
  copyable?: boolean;
}

const InfoRow = ({ label, value, copyable = false }: InfoRowProps) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[0.65rem] font-medium text-[var(--text-muted)] shrink-0">
      {label}
    </span>
    <div className="flex items-center gap-1.5 min-w-0 justify-end">
      <span className="text-[0.65rem] font-semibold text-[var(--text-primary)] truncate">
        {value}
      </span>
      {copyable && (
        <button
          type="button"
          title="Copiar"
          onClick={() => copyToClipboard(value)}
          className="shrink-0 text-[var(--text-muted)] hover:text-slate-800 transition-colors"
        >
          <Copy size={11} strokeWidth={2} />
        </button>
      )}
    </div>
  </div>
);
