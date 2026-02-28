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
        <div className={cn("flex flex-col gap-1", containerClass)}>
          <label
            htmlFor={name}
            className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]"
          >
            {label}
          </label>
          <input
            id={name}
            {...field}
            {...inputProps}
            value={field.value ?? ""}
            className={cn(
              "h-12 w-full rounded-2xl border border-black/10 bg-[var(--control-bg)] px-4 text-[0.95rem] text-[var(--text-primary)] outline-none transition focus:border-black focus:bg-white",
              fieldState.error && "border-[#dd5a5a]",
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
