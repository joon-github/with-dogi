import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ProductModule } from './routes/product/product.module';
import { BrandModule } from './routes/product/routes/brand/brand.module';
import { AuthModule } from './routes/auth/auth.module';
import { CategoryModule } from './routes/category/category.module';
import { OptionsModule } from './routes/product/routes/options/options.module';
import { QuestionModule } from './routes/product/routes/question/question.module';
import { AnwserModule } from './routes/product/routes/answer/answer.module';
import { CartModule } from './routes/product/routes/cart/cart.module';
import { OrderModule } from './routes/product/routes/order/order.module';
import { ReviewModule } from './routes/product/routes/review/review.module';

export function setupSwagger(app: INestApplication): void {
  const baseUrl = process.env.NODE_ENV === "production" ? process.env.BASE_URL : 'http://localhost:8000';
  const nav = `
  <a href="${baseUrl}/api-base-docs#/">기본 api</a>
  <br/>
  <a href="${baseUrl}/api-products-docs">상품 api</a>
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
    include: [
      ProductModule,
      CartModule,
      BrandModule,
      OptionsModule,
      QuestionModule,
      AnwserModule,
      OrderModule,
      ReviewModule,
    ],
  });

  SwaggerModule.setup('api-products-docs', app, productsDocument);

  SwaggerModule.setup('api-base-docs', app, document);
}
