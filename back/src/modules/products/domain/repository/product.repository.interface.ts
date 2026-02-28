
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { IProductRepositoryModel } from '../model/product-repository.model';
import { UpdateProductDto } from '../../application/dto/update-product.dto';


export interface IProductRepository {
  create(dto: CreateProductDto): Promise<{ message: string }>;
  findAll(): Promise<IProductRepositoryModel[]>;
  findOne(id: string): Promise<IProductRepositoryModel | null>;
  update(id: string, dto: UpdateProductDto): Promise<{ message: string }>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
