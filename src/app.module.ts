import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database.config';
import { VerifyTokenMiddleware } from './middleware/verifyToken.middleware';

import { MovieModule } from './movie/movie.module';
import { ProductModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    MovieModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ProductModule,
    AuthModule,
    BrandModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTokenMiddleware).forRoutes('*');
  }
}
