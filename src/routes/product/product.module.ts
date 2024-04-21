import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AuthModule } from 'src/routes/auth/auth.module';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { Brand } from 'src/routes/product/routes/brand/entities/brand.entity';
import { BrandService } from 'src/routes/product/routes/brand/brand.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/Category.entity';
import { ProductImage } from './entities/productImage.entity';
import { AwsService } from 'src/global/aws/aws.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Members, Brand, Category, ProductImage]),
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, BrandService, CategoryService, AwsService],
  exports: [
    ProductService,
    BrandService,
    CategoryService,
    AwsService,
    AuthModule,
  ],
})
export class ProductModule {}
