import { useFormContext, Controller } from "react-hook-form";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  hint?: string;
  containerClass?: string;
}

export const TextField = ({
  name,
  label,
  hint,
  containerClass,
  ...inputProps
}: TextFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("flex flex-col gap-0.5", containerClass)}>
          <label
            htmlFor={name}
            className="text-[0.65rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]"
          >
            {label}
          </label>
            <input
              id={name}
              {...field}
              {...inputProps}
              value={field.value ?? ""}
              className={cn(
                "h-8 w-full rounded-lg border border-black/10 bg-[var(--control-bg)] px-3 text-[0.8rem] text-[var(--text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)] focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:ring-offset-1",
                fieldState.error &&
                  "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-500/15",
                inputProps.className,
              )}
            />
          {hint && (
            <p className="text-xs text-[var(--text-tertiary)]">{hint}</p>
          )}
          {fieldState.error && (
            <p className="text-xs font-medium text-[#b42318]">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
