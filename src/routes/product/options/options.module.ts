import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { ProductService } from '../product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Option } from './entities/option.entity';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { AuthModule } from 'src/routes/auth/auth.module';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { Brand } from 'src/routes/brand/entities/brand.entity';
import { BrandService } from 'src/routes/brand/brand.service';
import { CategoryService } from 'src/routes/category/category.service';
import { Category } from 'src/routes/category/entities/Category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Option, Brand, Members, Category]),
    AuthModule,
  ],
  controllers: [OptionsController],
  providers: [
    OptionsService,
    ProductService,
    AuthService,
    BrandService,
    CategoryService,
  ],
})
export class OptionsModule {}
