import { httpClient } from "@/shared/predentation/http";
import type { Product } from "../domain/entity/product.interface";
import { productMapper } from "../domain/mappers/product_mapper";


export const getProduct = async (): Promise<Product[]> => {
    const response = await httpClient.get<Product[]>('/inventory/products');

    const product = productMapper(response.data);


    return product;
}