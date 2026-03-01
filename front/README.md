# Frontend — SPA de Checkout

Aplicación web de una sola página (SPA) para el flujo de checkout de e-commerce, construida con **React 19**, **Vite** y **TailwindCSS 4**.

---

## Stack

| Tecnología          | Versión | Rol                                  |
|---------------------|---------|--------------------------------------|
| React               | 19      | UI                                   |
| Vite                | 7       | Bundler / Dev server                 |
| TypeScript          | 5.9     | Lenguaje                             |
| TailwindCSS         | 4       | Estilos utilitarios                  |
| shadcn/ui + Radix   | latest  | Componentes accesibles               |
| React Router DOM    | 7       | Enrutamiento cliente                 |
| TanStack Query      | 5       | Fetching y caché de datos            |
| Redux Toolkit       | 2       | Estado global (carrito / checkout)   |
| React Hook Form     | 7       | Manejo de formularios                |
| Yup                 | 1       | Validación de esquemas               |
| Axios               | 1       | Cliente HTTP                         |
| Vitest              | 4       | Testing unitario                     |
| MSW                 | 2       | Mock Service Worker (tests)          |

---

## Instalación y desarrollo

```bash
pnpm install
pnpm run dev        # Dev server en http://localhost:5173
```

### Variable de entorno

Crear `.env` en la raíz de `front/` si necesitas apuntar a un backend distinto:

```env
VITE_API_URL=http://localhost:3000
```

---

## Estructura del proyecto

```
src/
├── assets/                    # Imágenes y recursos estáticos
├── components/                # Componentes reutilizables
│   ├── forms/                 # TextField, AutocompleteField
│   ├── loadings/              # LoadingPage (spinner de ruta)
│   └── ui/                    # Componentes shadcn (Button, Card, Badge…)
├── modules/                   # Módulos por página/dominio
│   ├── product/               # Listado y selección de producto
│   ├── checkout/              # Formulario de pago con tarjeta
│   ├── summarydetail/         # Resumen de la orden
│   └── orderstatus/           # Estado de la transacción
├── shared/
│   ├── predentation/
│   │   ├── router/            # Definición de rutas (React Router)
│   │   ├── layouts/           # DashboardLayout
│   │   └── handkeErrors/      # GlobalErrorBoundary, PageError
│   └── utils/                 # Helpers compartidos
├── lib/                       # Utilidades generales (cn, etc.)
├── App.tsx
└── main.tsx
```

Cada módulo sigue la convención:

```
módulo/
├── api/           # Llamadas HTTP (axios + TanStack Query)
├── application/   # Lógica de negocio / hooks de aplicación
├── domain/        # Tipos e interfaces
└── presentation/  # Componentes y páginas
```

---

## Rutas

| Ruta                      | Componente          | Descripción                          |
|---------------------------|---------------------|--------------------------------------|
| `/dashboard/product`      | ProductPage         | Vista principal del producto         |
| `/dashboard/checkout`     | CheckoutPage        | Formulario de pago                   |
| `/dashboard/summary`      | SummarydetailPage   | Resumen de la orden                  |
| `/dashboard/order-status` | OrderStatusPage     | Estado de la transacción             |
| `/404` / `*`              | PageError           | Página de error                      |

Todas las rutas del dashboard usan **lazy loading** con `Suspense`.

---

## Tests

```bash
pnpm run test             # Ejecución única
pnpm run test:watch       # Modo watch
pnpm run test:coverage    # Con cobertura
pnpm run test:ui          # Interfaz visual Vitest UI
```

Los mocks de red usan **MSW** (`src/test/mocks/`).

---

## Build y preview

```bash
pnpm run build      # Genera dist/
pnpm run preview    # Sirve el build en local
```
