import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
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
      Products,
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
