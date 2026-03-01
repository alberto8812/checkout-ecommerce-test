import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Product as PrismaProduct, Prisma } from 'generated/prisma/client';
import { IProductRepository } from '../../domain/repository/product.repository.interface';
import { IProductRepositoryModel } from '../../domain/model/product-repository.model';
import { PrismaService } from 'src/shared/database/prisma-manager.service';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { CreateProductDto } from '../../application/dto/create-product.dto';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  private readonly logger = new Logger(PrismaProductRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateProductDto): Promise<{ message: string }> {
    //made transaction to add stock

    await this.prisma.$transaction(async (tx) => {
      const { stock, ...productData } = dto;

      const product = await tx.product.create({
        data: {
          ...productData,
        },
      });

      if (dto.stock && dto.stock > 0) {
        await tx.stock.create({
          data: {
            productId: product.id,
            quantity: dto.stock,
            real_stock: dto.stock,
            reserved_stock: 0,
          },
        });
      }
    });

    return { message: 'Producto creado con exito' };

  }

  async findAll(): Promise<IProductRepositoryModel[]> {
    const products = await this.prisma.product.findMany();
    return products.map((product) => this.mapToModel(product));
  }

  async findOne(id: string): Promise<IProductRepositoryModel | null> {

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        stock: true,
      },
    });

    if (!product) {
      throw new BadRequestException(`Producto con id ${id} no encontrado`);
    }

    return this.mapToModel(product);
  }



  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new BadRequestException(`Producto con id ${id} no encontrado`);
    }

    const { stock, ...productData } = dto;

    await this.prisma.product.update({
      where: { id },
      data: {
        ...productData
      },
    });

    return { message: 'Producto actualizado con exito' };
  }




  private mapToModel(record: PrismaProduct): IProductRepositoryModel {
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      price: record.price,
      base_fee: record.base_fee,
    };
  }
}
