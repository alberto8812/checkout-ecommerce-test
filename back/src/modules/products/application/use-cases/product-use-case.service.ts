import { Inject, Injectable } from '@nestjs/common';
import { IProductUseCase } from '../interfaces/product-use-case.interface';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repository/product.repository.interface';

import { IProductRepositoryModel } from '../../domain/model/product-repository.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';


@Injectable()
export class ProductUseCaseService implements IProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) { }


  create(dto: CreateProductDto): Promise<{ message: string }> {
    return this.productRepository.create(dto);
  }


  findOne(id: string): Promise<IProductRepositoryModel | null> {
    return this.productRepository.findOne(id);
  }



  update(id: string, dto: UpdateProductDto): Promise<{ message: string }> {
    return this.productRepository.update(id, dto);
  }


}
