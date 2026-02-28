import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

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
    <div className={cn("relative flex flex-col gap-1", containerClass)}>
      <label
        htmlFor={name}
        className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]"
      >
        {label}
      </label>
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
          "h-12 w-full rounded-2xl border border-black/10 bg-[var(--control-bg)] px-4 text-[0.95rem] text-[var(--text-primary)] outline-none transition focus:border-black focus:bg-white",
          fieldState.error && "border-[#dd5a5a]",
        )}
        autoComplete="off"
      />
      {fieldState.error && (
        <p className="text-xs font-medium text-[#b42318]">
          {fieldState.error.message}
        </p>
      )}

      {isOpen && (
        <ul className="absolute top-full z-30 mt-2 max-h-48 w-full overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-lg">
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-sm text-[var(--text-tertiary)]">
              Sin resultados
            </li>
          )}
          {filtered.map((option) => (
            <li
              key={option.value}
              className="cursor-pointer px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-black/5"
              onMouseDown={(event) => {
                event.preventDefault();
                setInputValue(option.label);
                field.onChange(option.value);
                setIsOpen(false);
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                {option.helper && (
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {option.helper}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
