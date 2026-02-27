import { IPaginatedResult } from '../../../../../shared/application/interfaces/pagination.interface';
import { PaginationDto } from '../../../../../shared/application/dto/pagination.dto';
import { IProductRepositoryModel } from '../../domain/model/product-repository.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductUseCase {
  create(dto: CreateProductDto): Promise<{ message: string }>;
  findAll(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResult<IProductRepositoryModel>>;
  findOne(id: string): Promise<IProductRepositoryModel | null>;
  findBySku(
    companyId: string,
    sku: string,
  ): Promise<IProductRepositoryModel | null>;
  findByBarcode(
    companyId: string,
    barcode: string,
  ): Promise<IProductRepositoryModel | null>;
  update(id: string, dto: UpdateProductDto): Promise<{ message: string }>;
  remove(id: string): Promise<{ message: string }>;
}

export const PRODUCT_USE_CASE = Symbol('PRODUCT_USE_CASE');
