import { ShieldCheck, Star, Truck, Check, Lock } from "lucide-react";

/* ─── Mock data ──────────────────────────────────────────────────────────── */
const product = {
  name: "Sony WH-1000XM5",
  price: 349.99,
  currency: "USD",
  description:
    "Audífonos inalámbricos premium con cancelación de ruido adaptativa, 30 horas de batería y audio Hi-Res. Diseño ultraligero y plegable con micrófono de alta calidad para llamadas cristalinas.",
  image:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  features: [
    "Cancelación de ruido líder en la industria",
    "30 horas de batería",
    "Audio Hi-Res certificado",
    "Conexión multipunto Bluetooth 5.3",
    "Diseño plegable ultraligero (250g)",
  ],
  reviewCount: 2847,
  rating: 4,
};

const trustBadges = [
  { icon: ShieldCheck, label: "Pago seguro" },
  { icon: Truck, label: "Envío gratis" },
  { icon: Lock, label: "Garantía 2 años" },
];

/* ─── Star rating ────────────────────────────────────────────────────────── */
function StarRating({ rating, total = 5 }: { rating: number; total?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4"
          style={{
            flexShrink: 0,
            fill: i < rating ? "var(--amber)" : "var(--border-default)",
            color: i < rating ? "var(--amber)" : "var(--border-default)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── ProductPage ─────────────────────────────────────────────────────────── */
export const ProductPage = () => {
  return (
    <div className="enterprise-card">
      <div className="product-split">
        {/* ── Left Column: Product Image ── */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div
            className="relative overflow-hidden mb-5 md:mb-0"
            style={{
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--surface-1)",
              border: "1px solid var(--border-subtle)",
              flexGrow: 1,
              minHeight: "320px",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Disponible badge */}
            <span
              className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: "var(--green-500)",
                color: "#fff",
              }}
            >
              Disponible
            </span>
          </div>
        </div>

        {/* ── Right Column: Product Details & Actions ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* ── Name + Price row ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "0.375rem",
            }}
          >
            <h1
              style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: 600, lineHeight: 1.3 }}
            >
              {product.name}
            </h1>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <p
                className="num"
                style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}
              >
                ${product.price.toFixed(2)}
              </p>
              <p
                style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}
              >
                {product.currency}
              </p>
            </div>
          </div>

          {/* ── Rating ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <StarRating rating={product.rating} />
            <span style={{ fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
              ({product.reviewCount.toLocaleString()} reseñas)
            </span>
          </div>

          {/* ── Description ── */}
          <p
            className="mb-5 text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {product.description}
          </p>

          {/* ── Feature list ── */}
          <ul className="mb-5 flex flex-col gap-2.5">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "var(--green-bg)",
                    color: "var(--green-500)",
                  }}
                >
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span style={{ color: "var(--text-secondary)" }}>{feature}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "auto" }}>
            {/* ── Trust badges ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginBottom: "1.25rem",
                padding: "0.875rem 0.5rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--surface-0)",
              }}
            >
              {trustBadges.map(({ icon: Icon, label }, index) => (
                <div key={label} style={{ display: "flex", flexDirection: "row", alignItems: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0 0.875rem",
                      textAlign: "center",
                    }}
                  >
                    <Icon
                      style={{ height: "1.125rem", width: "1.125rem", color: "var(--green-500)", flexShrink: 0 }}
                    />
                    <span
                      style={{ color: "var(--text-secondary)", fontSize: "0.7rem", whiteSpace: "nowrap" }}
                    >
                      {label}
                    </span>
                  </div>
                  {index < trustBadges.length - 1 && (
                    <div
                      style={{ height: "2rem", width: "1px", backgroundColor: "var(--border-subtle)", flexShrink: 0 }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* ── CTA Button (Sticky on Mobile, integrated on Desktop) ── */}
            <div className="sticky-bottom-bar">
              <button
                className="w-full rounded-xl py-4 text-sm font-semibold transition-opacity duration-150 hover:opacity-85 active:opacity-75"
                style={{
                  backgroundColor: "var(--cta-bg)",
                  color: "var(--cta-text)",
                  boxShadow: "0 4px 14px 0 rgba(0,0,0,0.12)",
                }}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
