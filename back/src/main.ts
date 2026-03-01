import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
async function bootstrap() {
  const logger = new Logger('checkout-ecommerce');
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS
  app.enableCors({
    origin: '*', // O pon aquí el origen de tu frontend
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Checkout Ecomerce')
    .setDescription('Documentación de la API de Checkout Ecomerce')
    .setVersion('1.0')
    .addTag('checkout-ecommerce')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(envs.port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
