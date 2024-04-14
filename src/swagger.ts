import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ProductModule } from './routes/product/product.module';
import { BrandModule } from './routes/brand/brand.module';
import { AuthModule } from './routes/auth/auth.module';
import { CategoryModule } from './routes/category/category.module';
import { OptionsModule } from './routes/product/options/options.module';

export function setupSwagger(app: INestApplication): void {
  //현재 경로
  const nav = `
  <a href="http://localhost:8000/api-base-docs#/">기본 api</a>
  <br/>
  <a href="http://localhost:8000/api-products-docs">상품 api</a>
  `;
  const options = new DocumentBuilder()
    .setTitle('기본 API')
    .setDescription(nav)
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [AuthModule, CategoryModule],
  });

  const productsOptions = new DocumentBuilder()
    .setTitle('상품 API')
    .setDescription(nav)
    .setVersion('1.0.0')
    .build();

  const productsDocument = SwaggerModule.createDocument(app, productsOptions, {
    include: [ProductModule, BrandModule, OptionsModule],
  });

  SwaggerModule.setup('api-products-docs', app, productsDocument);

  SwaggerModule.setup('api-base-docs', app, document);
}
