import type { InputHTMLAttributes } from "react";
import type { AutoCompleteOption } from "@/components/forms";
import { cities, countries } from "../constants/locationData";

export type CheckoutSection = "payment" | "shipping";
export type FieldComponentType = "text" | "autocomplete";

export interface CheckoutFormValues {
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface CheckoutFieldConfig {
    name: keyof CheckoutFormValues;
    label: string;
    value: string;
    component: FieldComponentType;
    placeholder?: string;
    section: CheckoutSection;
    style?: string;
    helper?: string;
    inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
    type?: string;
    options?: AutoCompleteOption[];
}

export const checkoutFields: CheckoutFieldConfig[] = [
    {
        name: "cardNumber",
        label: "Numero de tarjeta",
        value: "",
        component: "text",
        placeholder: "0000 0000 0000 0000",
        section: "payment",
        style: "md:col-span-2",
        inputMode: "numeric",
    },
    {
        name: "cardHolder",
        label: "Nombre en la tarjeta",
        value: "JUAN PEREZ",
        component: "text",
        placeholder: "JUAN PEREZ",
        section: "payment",
        style: "md:col-span-2",
    },
    {
        name: "expiry",
        label: "Vencimiento",
        value: "",
        component: "text",
        placeholder: "MM/AA",
        section: "payment",
        style: "md:col-span-1",
    },
    {
        name: "cvv",
        label: "CVV",
        value: "",
        component: "text",
        placeholder: "***",
        section: "payment",
        style: "md:col-span-1",
        inputMode: "numeric",
    },
    {
        name: "fullName",
        label: "Nombre completo",
        value: "Juan Perez",
        component: "text",
        placeholder: "Juan Perez",
        section: "shipping",
        style: "md:col-span-2",
    },
    {
        name: "email",
        label: "Correo electronico",
        value: "juan@ejemplo.com",
        component: "text",
        placeholder: "juan@ejemplo.com",
        section: "shipping",
        style: "md:col-span-2",
        inputMode: "email",
        type: "email",
    },
    {
        name: "address",
        label: "Direccion",
        value: "Av. Principal 123, Apt 4B",
        component: "text",
        placeholder: "Av. Principal 123, Apt 4B",
        section: "shipping",
        style: "md:col-span-2",
    },
    {
        name: "city",
        label: "Ciudad",
        value: "cdmx-mx",
        component: "autocomplete",
        placeholder: "Ciudad de Mexico",
        section: "shipping",
        style: "md:col-span-1",
        options: cities,
    },
    {
        name: "postalCode",
        label: "C.P.",
        value: "01000",
        component: "text",
        placeholder: "01000",
        section: "shipping",
        style: "md:col-span-1",
        inputMode: "numeric",
    },
    {
        name: "country",
        label: "Pais",
        value: "MX",
        component: "autocomplete",
        placeholder: "Selecciona un pais",
        section: "shipping",
        style: "md:col-span-2",
        options: countries,
    },
];

export const checkoutSections: { id: CheckoutSection; title: string; icon: string }[] = [
    { id: "payment", title: "Datos de la tarjeta", icon: "💳" },
    { id: "shipping", title: "Datos de envio", icon: "📦" },
];

export const defaultValues = checkoutFields.reduce<CheckoutFormValues>((acc, field) => {
    acc[field.name] = field.value;
    return acc;
}, {} as CheckoutFormValues);
