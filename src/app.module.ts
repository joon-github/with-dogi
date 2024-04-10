import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database.config';
import { VerifyTokenMiddleware } from './middleware/verifyToken.middleware';

import { ProductModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { CategoriesModule } from './categories/categories.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ProductModule,
    BrandModule,
    CategoriesModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST }, // 로그인 경로 제외
        { path: 'auth/logout', method: RequestMethod.POST }, // 로그인 경로 제외
        { path: 'auth/signup', method: RequestMethod.POST }, // 회원가입 경로 제외
        { path: 'auth/accessToken', method: RequestMethod.POST }, // 토큰재발급 경로 제외
      )
      .forRoutes('*');
  }
}
