import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { AuthModule } from 'src/routes/auth/auth.module';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { Brand } from 'src/routes/brand/entities/brand.entity';
import { BrandService } from 'src/routes/brand/brand.service';
import { CategoriesService } from '../categories/categories.service';
import { Categories } from '../categories/entities/Categories.entity';
import { OptionsModule } from './options/options.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Members,
      Brand,
      Categories,
      OptionsModule,
    ]),
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, AuthService, BrandService, CategoriesService],
})
export class ProductModule {}
