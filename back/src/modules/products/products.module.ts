import { Module } from '@nestjs/common';
import { ProductUseCaseService } from './application/use-cases/product-use-case.service';
import { PRODUCT_REPOSITORY } from './domain/repository/product.repository.interface';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { PRODUCT_USE_CASE } from './application/interfaces/product-use-case.interface';

import { ProductController } from './infrastructure/controllers/product.controller';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
    {
      provide: PRODUCT_USE_CASE,
      useClass: ProductUseCaseService,
    },
  ],
})
export class ProductsModule { }
