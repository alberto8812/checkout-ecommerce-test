import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool, { schema: 'public' });
const prisma = new PrismaClient({ adapter });

async function main() {
    // Limpiar datos existentes (respetar FK: TransactionItem antes de Transaction)
    await prisma.delivery.deleteMany({});
    await prisma.transactionItem.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.stock.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.product.deleteMany({});

    // Crear un producto
    const product = await prisma.product.create({
        data: {
            name: 'Laptop HP Pavilion 15',
            description: 'Laptop de alto rendimiento con procesador Intel i7, 16GB RAM y 512GB SSD',
            price: 1499000,  // COP
            base_fee: 25000, // COP
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
        },
    });

    // Crear stock para el producto
    const stock = await prisma.stock.create({
        data: {
            productId: product.id,
            quantity: 10,
            real_stock: 10,
            reserved_stock: 0,
        },
    });

    console.log('✅ Seed completado exitosamente');
    console.log('Producto:', product);
    console.log('Stock:', stock);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
