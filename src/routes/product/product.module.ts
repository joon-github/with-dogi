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
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/Category.entity';
import { OptionsModule } from './options/options.module';
import { AwsService } from 'src/global/aws/aws.service';
import { ConfigService } from '@nestjs/config';
import { ProductImage } from './entities/productImage.entity';
import { ProductImageService } from './productImage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Members, Brand, Category, ProductImage]),
    AuthModule,
    OptionsModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    AuthService,
    BrandService,
    CategoryService,
    AwsService,
    ConfigService,
    ProductImageService,
  ],
})
export class ProductModule {}
