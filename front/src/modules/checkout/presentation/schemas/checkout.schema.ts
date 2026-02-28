import * as yup from "yup";
import type { AnyObjectSchema } from "yup";

export const checkoutSchema: AnyObjectSchema = yup
    .object({
        cardNumber: yup
            .string()
            .required("Ingresa el numero de tu tarjeta")
            .matches(/^(\d{4}\s?){4}$/u, "Formato invalido"),
        cardHolder: yup
            .string()
            .required("Ingresa el nombre como aparece en la tarjeta"),
        expiry: yup
            .string()
            .required("Ingresa la fecha de vencimiento")
            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/u, "Usa el formato MM/AA"),
        cvv: yup
            .string()
            .required("Ingresa el CVV")
            .matches(/^[0-9]{3,4}$/u, "CVV invalido"),
        fullName: yup.string().required("Tu nombre es obligatorio"),
        email: yup
            .string()
            .email("Correo invalido")
            .required("Ingresa un correo"),
        address: yup.string().required("Ingresa una direccion"),
        city: yup.string().required("Selecciona una ciudad"),
        postalCode: yup
            .string()
            .required("Ingresa tu codigo postal")
            .matches(/^[0-9]{4,6}$/u, "Codigo postal invalido"),
        country: yup.string().required("Selecciona un pais"),
    })
    .required();
