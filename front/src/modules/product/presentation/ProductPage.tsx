import { ShieldCheck, Star, Truck, Check, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

/* ─── Mock data ────────────────────────────────────────────────────────────── */
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

/* ─── Star rating ──────────────────────────────────────────────────────────── */
function StarRating({ rating, total = 5 }: { rating: number; total?: number }) {
  return (
    <div className="flex flex-row items-center gap-[2px]">
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 shrink-0 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── ProductPage ──────────────────────────────────────────────────────────── */
export const ProductPage = () => {
  return (
    <Card className="enterprise-card border-none shadow-none bg-transparent">
      <CardContent className="product-split p-0">
        {/* ── Left Column: Product Image ── */}
        <div className="relative mb-5 min-h-[320px] h-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80 md:mb-0">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Bottom gradient for depth */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Disponible badge — frosted glass */}
          <Badge className="absolute right-4 top-4 z-10 border border-white/20 bg-emerald-500/90 py-1 text-xs text-white backdrop-blur-sm hover:bg-emerald-500/90">
            Disponible
          </Badge>
        </div>

        {/* ── Right Column: Product Details & Actions ── */}
        <div className="flex flex-col">
          {/* ── Name + Price row ── */}
          <div className="mb-1.5 flex flex-row items-start justify-between gap-4">
            <h1 className="text-[1.25rem] font-semibold leading-[1.3] tracking-[-0.025em] text-slate-950">
              {product.name}
            </h1>
            <div className="shrink-0 text-right">
              <p className="num text-2xl font-bold leading-none tracking-[-0.03em] text-slate-950">
                <span className="text-base font-semibold text-slate-400 mr-0.5">$</span>
                {product.price.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-slate-400">{product.currency}</p>
            </div>
          </div>

          {/* ── Rating ── */}
          <div className="mb-4 flex flex-row items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-sm text-slate-500">
              ({product.reviewCount.toLocaleString()} reseñas)
            </span>
          </div>

          {/* ── Description ── */}
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>

          <Separator className="mb-4 bg-slate-100" />

          {/* ── Feature list ── */}
          <ul className="mb-5 flex flex-col gap-2.5">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <span className="flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span className="text-slate-600">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            {/* ── Trust badges ── */}
            <div className="mb-5 flex flex-row items-center justify-around rounded-lg border border-slate-100 bg-white px-2 py-3.5">
              {trustBadges.map(({ icon: Icon, label }, index) => (
                <div key={label} className="flex shrink-0 flex-row items-center">
                  <div className="flex flex-col items-center gap-1.5 px-3.5 text-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                      <Icon className="h-[1rem] w-[1rem] shrink-0 text-emerald-600" />
                    </div>
                    <span className="whitespace-nowrap text-[0.7rem] text-slate-500">
                      {label}
                    </span>
                  </div>
                  {index < trustBadges.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="mx-2 h-8 bg-slate-100"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* ── CTA Button ── */}
            <div className="sticky-bottom-bar">
              <Button
                size="lg"
                className="w-full rounded-xl py-6 text-base font-semibold transition-all duration-200 
                           bg-slate-900 text-white hover:bg-slate-800 
                           hover:-translate-y-px hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.18)]
                           active:translate-y-0 active:opacity-80
                           focus-visible:ring-2 focus-visible:ring-slate-900/30 focus-visible:ring-offset-2
                           shadow-[0_4px_14px_0_rgba(0,0,0,0.12)]"
              >
                Comprar ahora
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPage;
