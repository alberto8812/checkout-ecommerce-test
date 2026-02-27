# Backend de Checkout Ecommerce

## Descripción

Backend de una aplicación de e-commerce construido con **NestJS** y **PostgreSQL**. El proyecto implementa una arquitectura limpia con separación de responsabilidades entre capas de aplicación, dominio e infraestructura.

## 🚀 Tecnologías

- **NestJS** - Framework de Node.js para aplicaciones escalables
- **TypeScript** - Lenguaje de tipado estático
- **Prisma** - ORM para gestión de base de datos
- **PostgreSQL** - Base de datos relacional
- **Swagger** - Documentación automática de APIs
- **Jest** - Framework de testing
- **ESLint & Prettier** - Linting y formateo de código

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- pnpm o npm
- PostgreSQL (v12 o superior)

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd checkout-ecommerce/back
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (o usa `.env.template` como referencia):

```env
# Configuración de Base de Datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/base_datos"
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=usuario
DB_PASSWORD=contraseña
DB_NAME=base_datos

# Configuración de Servidor
PORT=3000
```

### 4. Configurar la base de datos

```bash
# Crear el esquema y tablas
pnpm exec prisma migrate dev

# Generar el cliente de Prisma
pnpm exec prisma generate
```

## 🌱 Seedear la Base de Datos

Para poblar la base de datos con datos iniciales (1 producto y su stock):

```bash
pnpm seed
```

Esto creará:
- **1 Producto**: Laptop HP Pavilion 15
  - Precio: $899.99
  - Descripción: Laptop de alto rendimiento con procesador Intel i7, 16GB RAM y 512GB SSD
  - Imagen: URL de Unsplash
- **1 Stock** asociado al producto con cantidad inicial de 10 unidades

## 🏃 Ejecución

### Modo desarrollo

```bash
pnpm start:dev
```

El servidor estará disponible en `http://localhost:3000`

### Modo producción

```bash
# Compilar proyecto
pnpm build

# Iniciar servidor compilado
pnpm start:prod
```

### Modo debug

```bash
pnpm start:debug
```

## 🧪 Testing

```bash
# Ejecutar pruebas unitarias
pnpm test

# Modo watch
pnpm test:watch

# Coverage
pnpm test:cov

# Pruebas e2e
pnpm test:e2e
```

## 📝 Linting y Formateo

```bash
# Ejecutar eslint
pnpm lint

# Formatear código
pnpm format
```

## 🏗️ Estructura del Proyecto

```
src/
├── config/              # Configuración de la aplicación
├── modules/             # Módulos de negocio
│   └── products/        # Módulo de productos
│       ├── application/ # Casos de uso y DTOs
│       ├── domain/      # Modelos de dominio
│       └── infrastructure/ # Controladores y repositorios
├── shared/              # Código compartido
│   ├── database/        # Gestión de base de datos
│   ├── decorators/      # Decoradores personalizados
│   └── exceptions/      # Excepciones personalizadas
├── app.module.ts        # Módulo raíz
└── main.ts              # Punto de entrada
```

## 📊 Modelos de Base de Datos

### Product (Producto)
- `id` - Identificador único (CUID)
- `name` - Nombre del producto
- `description` - Descripción del producto
- `price` - Precio del producto
- `base_fee` - Tarifa base de transacción
- `image` - URL de la imagen del producto
- `stock` - Relación con tabla Stock
- `transactions` - Relación con tabla Transaction

### Stock (Inventario)
- `id` - Identificador único (CUID)
- `productId` - Referencia al producto
- `quantity` - Cantidad total disponible
- `real_stock` - Stock real en inventario
- `reserved_stock` - Stock reservado
- `product` - Relación con tabla Product

### Customer (Cliente)
- `id` - Identificador único (CUID)
- `name` - Nombre del cliente
- `email` - Correo electrónico (único)
- `phone` - Teléfono
- `address` - Dirección
- `city`, `state`, `country`, `zip_code` - Información de ubicación
- `transactions` - Relación con tabla Transaction

### Transaction (Transacción)
- `id` - Identificador único (CUID)
- `customerId` - Referencia al cliente
- `amount` - Monto de la transacción
- `currency` - Moneda
- `status` - Estado de la transacción
- `wompi_transaction_id` - ID de transacción en Wompi
- `products` - Relación con tabla Product
- `deliveries` - Relación con tabla Delivery

### Delivery (Entrega)
- `id` - Identificador único (CUID)
- `transactionId` - Referencia a la transacción
- `delivery_address` - Dirección de entrega
- `delivery_fee` - Costo de envío
- `status` - Estado del envío
- `transaction` - Relación con tabla Transaction

## 📚 Documentación de API

Una vez que el servidor está corriendo, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/api
```

## 🤝 Migraciones de Base de Datos

Ver el estado de las migraciones:
```bash
pnpm exec prisma migrate status
```

Crear una nueva migración:
```bash
pnpm exec prisma migrate dev --name nombre_migracion
```

Resetear la base de datos (desarrollo solamente):
```bash
pnpm exec prisma migrate reset
```

Visualizar datos en Prisma Studio:
```bash
pnpm exec prisma studio
```

## 🔧 Comandos Útiles

```bash
# Generar tipos de Prisma
pnpm exec prisma generate

# Ver esquema visual
pnpm exec prisma studio

# Limpiar y resetear
pnpm exec prisma migrate reset --force

# Ejecutar seed
pnpm seed
```

## 📦 Scripts del Proyecto

- `pnpm build` - Compilar proyecto
- `pnpm start` - Iniciar servidor
- `pnpm start:dev` - Iniciar en modo desarrollo con watch
- `pnpm start:debug` - Iniciar en modo debug
- `pnpm start:prod` - Iniciar servidor compilado
- `pnpm test` - Ejecutar pruebas
- `pnpm test:watch` - Pruebas en modo watch
- `pnpm test:cov` - Pruebas con reporte de cobertura
- `pnpm test:e2e` - Pruebas end-to-end
- `pnpm lint` - Ejecutar linter
- `pnpm format` - Formatear código
- `pnpm seed` - Poblar base de datos con datos iniciales

## 🔐 Seguridad

- Valida todas las variables de entorno
- Utiliza Joi para validación de esquemas
- Implementa DTOs para validación de entrada
- Las contraseñas nunca se almacenan en logs

## 🐛 Troubleshooting

### Error de conexión a base de datos
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en el archivo `.env`
- Verifica que la base de datos existe

### Error en migraciones
```bash
# Resetear migraciones (solo en desarrollo)
pnpm exec prisma migrate reset --force
```

### Errores de tipado de Prisma
```bash
# Regenerar cliente de Prisma
pnpm exec prisma generate
```

## 📄 Licencia

Este proyecto está bajo la licencia UNLICENSED.

## 👤 Autor

Proyecto desarrollado con NestJS y Prisma.

---

**Nota**: Asegúrate de configurar correctamente las variables de entorno antes de ejecutar el proyecto.
