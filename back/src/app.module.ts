import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DatabaseModule } from './shared/database/database.module';


@Module({
  imports: [DatabaseModule, ProductsModule, PaymentsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
