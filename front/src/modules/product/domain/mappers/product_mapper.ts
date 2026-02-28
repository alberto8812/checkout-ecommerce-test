import type { Product } from "../entity/product.interface";

export const productMapper = (product: Product[]): Product[] => {
    return product.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        base_fee: product.base_fee,
    }));
}