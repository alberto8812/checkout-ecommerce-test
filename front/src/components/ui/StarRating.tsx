import { Star } from "lucide-react";

export const StarRating = ({ rating, total = 5 }: { rating: number; total?: number }) => {
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
};  