import type { AutoCompleteOption } from "@/components/forms";

export const countries: AutoCompleteOption[] = [
    { label: "Colombia", value: "CO", helper: "Bogotá, Medellín, Cali" },
    { label: "México", value: "MX", helper: "CDMX, Guadalajara, Monterrey" },
    { label: "Chile", value: "CL", helper: "Santiago, Valparaíso, Concepción" },
    { label: "Perú", value: "PE", helper: "Lima, Cusco, Arequipa" },
    { label: "Argentina", value: "AR", helper: "Buenos Aires, Córdoba, Rosario" },
    { label: "Costa Rica", value: "CR", helper: "San José, Liberia, Limón" },
];

export const cities: AutoCompleteOption[] = [
    { label: "Bogotá", value: "bogota-co", helper: "Colombia" },
    { label: "Medellín", value: "medellin-co", helper: "Colombia" },
    { label: "Cartagena", value: "cartagena-co", helper: "Colombia" },
    { label: "Ciudad de México", value: "cdmx-mx", helper: "México" },
    { label: "Guadalajara", value: "gdl-mx", helper: "México" },
    { label: "Monterrey", value: "mty-mx", helper: "México" },
    { label: "Santiago", value: "scl-cl", helper: "Chile" },
    { label: "Valparaíso", value: "vapar-cl", helper: "Chile" },
    { label: "Lima", value: "lima-pe", helper: "Perú" },
    { label: "Cusco", value: "cusco-pe", helper: "Perú" },
    { label: "Buenos Aires", value: "bsas-ar", helper: "Argentina" },
    { label: "Rosario", value: "rosario-ar", helper: "Argentina" },
    { label: "San José", value: "sjo-cr", helper: "Costa Rica" },
    { label: "Liberia", value: "liberia-cr", helper: "Costa Rica" },
];
