import { ShieldCheck, Truck, Star } from "lucide-react";

export const ProductPage = () => {
  //   const dispatch = useAppDispatch();
  //   const product = useAppSelector((s) => s.checkout.product);

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Product Image */}
      <div className="overflow-hidden rounded-xl bg-card shadow-sm">
        <div className="relative aspect-square w-full bg-secondary">
          {/* <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
            /> */}
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            Disponible
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground text-balance">
              {/* {product.name} */}
            </h1>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < 4
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">
                {"(2,847 resenas)"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-foreground">
              {/* ${product.price} */}
            </span>
            <span className="text-xs text-muted-foreground">
              {/* {product.currency} */}
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {/* {product.description} */}
        </p>

        {/* Features */}
        <div className="flex flex-col gap-2">
          {/* {product.features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))} */}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 rounded-lg bg-card p-3">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="text-[10px] font-medium text-muted-foreground">
              Pago seguro
            </span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <Truck className="h-5 w-5 text-accent" />
            <span className="text-[10px] font-medium text-muted-foreground">
              {"Envio gratis"}
            </span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <svg
              className="h-5 w-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-[10px] font-medium text-muted-foreground">
              {"Garantia 2 anos"}
            </span>
          </div>
        </div>

        {/* CTA */}
        {/* <button
        onClick={() => dispatch(goToStep(2))}
        className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
      >
        Comprar ahora
      </button> */}
      </div>
    </div>
  );
};

export default ProductPage;
