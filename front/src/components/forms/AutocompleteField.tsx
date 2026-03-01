import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface AutoCompleteOption {
  label: string;
  value: string;
  helper?: string;
}

interface AutocompleteFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  options: AutoCompleteOption[];
  containerClass?: string;
}

export const AutocompleteField = ({
  name,
  label,
  placeholder,
  options,
  containerClass,
}: AutocompleteFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AutocompleteInput
          {...{
            field,
            fieldState,
            label,
            placeholder,
            options,
            containerClass,
            name,
          }}
        />
      )}
    />
  );
};

interface AutocompleteInputProps extends AutocompleteFieldProps {
  field: any;
  fieldState: any;
}

const AutocompleteInput = ({
  field,
  fieldState,
  label,
  placeholder,
  options,
  containerClass,
  name,
}: AutocompleteInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const match = options.find((option) => option.value === field.value);
    if (match) {
      setInputValue(match.label);
      return;
    }
    setInputValue(field.value ?? "");
  }, [field.value, options]);

  const filtered = useMemo(() => {
    if (!inputValue) return options.slice(0, 5);
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue, options]);

  return (
    <div className={cn("relative flex flex-col gap-0.5", containerClass)}>
      <label
        htmlFor={name}
        className="text-[0.65rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            field.onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 120);
          }}
          placeholder={placeholder}
          className={cn(
            "h-8 w-full rounded-lg border border-black/10 bg-[var(--control-bg)] px-3 pr-8 text-[0.8rem] text-[var(--text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)] focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:ring-offset-1",
            fieldState.error &&
              "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-500/15",
          )}
          autoComplete="off"
        />
        <ChevronDown
          size={16}
          className={cn(
            "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </div>
      {fieldState.error && (
        <p className="text-xs font-medium text-[#b42318]">
          {fieldState.error.message}
        </p>
      )}

      {isOpen && (
        <ul className="absolute top-full z-30 mt-1.5 max-h-44 w-full overflow-y-auto rounded-xl border border-black/10 bg-white shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          {filtered.length === 0 && (
            <li className="px-3.5 py-2 text-xs text-[var(--text-tertiary)]">
              Sin resultados
            </li>
          )}
          {filtered.map((option) => {
            const isSelected = option.value === field.value;
            return (
              <li
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3.5 py-2 text-xs text-[var(--text-primary)] transition-colors hover:bg-slate-50",
                  isSelected && "bg-slate-50 font-medium",
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  setInputValue(option.label);
                  field.onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-1 flex-col">
                  <span className="font-medium">{option.label}</span>
                  {option.helper && (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {option.helper}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check size={14} className="shrink-0 text-emerald-600" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
