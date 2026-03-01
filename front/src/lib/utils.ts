import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea un valor numérico como pesos colombianos (COP) sin símbolo de moneda.
 *  Ej: 1499000 → "1.499.000" */
export function formatCOP(value: number): string {
  return Math.round(value).toLocaleString('es-CO');
}
