import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Endpoint } from 'src/shared/decorators/endpoint.decorator';
import { ExceptionResponse } from 'src/shared/exceptions/exception-response';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';

@ApiTags('Inventory - Products')
@Controller('inventory/products')
export class ProductController {
  constructor(private readonly) { }

  @Endpoint({
    method: 'POST',
    summary: 'Create a new product',
    route: '',
    responses: [
      { status: 201, description: 'Product created', type: Object },
      { status: 400, description: 'Bad Request', type: ExceptionResponse },
    ],
  })
  create(@Body() createProductDto: CreateProductDto) {

  }


  @Endpoint({
    method: 'GET',
    summary: 'Get a product by ID',
    route: ':id',
    responses: [
      { status: 200, description: 'Product found', type: Object },
      { status: 404, description: 'Not Found', type: ExceptionResponse },
    ],
  })
  findOne(@Param('id') id: string) {

  }

  @Endpoint({
    method: 'PATCH',
    summary: 'Update a product',
    route: ':id',
    responses: [
      { status: 200, description: 'Product updated', type: Object },
      { status: 404, description: 'Not Found', type: ExceptionResponse },
    ],
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {

  }

}
