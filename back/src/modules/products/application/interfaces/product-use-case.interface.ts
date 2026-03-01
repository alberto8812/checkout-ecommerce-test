import { IProductRepositoryModel } from '../../domain/model/product-repository.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';


export interface IProductUseCase {
  create(dto: CreateProductDto): Promise<{ message: string }>;

  findAll(): Promise<IProductRepositoryModel[]>;

  findOne(id: string): Promise<IProductRepositoryModel | null>;

  update(id: string, dto: UpdateProductDto): Promise<{ message: string }>;

}

export const PRODUCT_USE_CASE = Symbol('PRODUCT_USE_CASE');
