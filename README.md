# Checkout E-Commerce

Plataforma de e-commerce con integración al pasarela de pagos **Wompi**. Permite a los usuarios navegar productos, completar un checkout con tarjeta de crédito y consultar el estado de sus órdenes en tiempo real.

---

## Arquitectura General

```
checkout-ecommerce/
├── back/        # API REST — NestJS + Prisma + PostgreSQL
└── front/       # SPA — React 19 + Vite + TailwindCSS
```

El proyecto sigue una arquitectura **monorepo** con dos aplicaciones independientes que se comunican vía HTTP.

```
[Usuario] → [React SPA :5173] → [NestJS API :3000] → [PostgreSQL :5433]
                                          ↕
                                   [Wompi Gateway]
```

---

## Flujo de Compra

```
/dashboard/product  →  /dashboard/checkout  →  /dashboard/summary  →  /dashboard/order-status
     (ver producto)       (datos + pago)            (resumen)              (estado de orden)
```

---

## Requisitos Previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js     | 20+           |
| pnpm        | 9+            |
| Docker      | 24+           |

---

## Inicio Rápido

### 1. Levantar la base de datos

```bash
cd back
docker-compose up -d
```

### 2. Configurar variables de entorno del backend

```bash
cd back
cp .env.example .env   # Completar con tus claves Wompi
```

### 3. Instalar dependencias y migrar

```bash
# Backend
cd back && pnpm install
pnpm prisma migrate dev
pnpm run seed          # Carga productos de prueba

# Frontend
cd ../front && pnpm install
```

### 4. Ejecutar en modo desarrollo

```bash
# Terminal 1 — Backend
cd back && pnpm run start:dev

# Terminal 2 — Frontend
cd front && pnpm run dev
```

| Servicio   | URL                         |
|------------|-----------------------------|
| Frontend   | http://localhost:5173        |
| Backend    | http://localhost:3000        |
| Swagger    | http://localhost:3000/api    |
| PostgreSQL | localhost:5433               |

---

## Stack Tecnológico

| Capa        | Tecnología                            |
|-------------|---------------------------------------|
| Frontend    | React 19, Vite, TailwindCSS 4, shadcn |
| Backend     | NestJS 11, Prisma 7, PostgreSQL 16    |
| Pagos       | Wompi (Colombia)                      |
| Testing     | Vitest (front) / Jest (back)          |

---

## Documentos Específicos

- [Backend — README](back/README.md)
- [Frontend — README](front/README.md)
