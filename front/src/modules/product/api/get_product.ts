import { httpClient } from "@/shared/predentation/http";
import type { Product } from "../domain/entity/product.interface";

export const getProduct = async () => {

    const response = await httpClient.get<Product[]>('/products');
    return response.data;


}