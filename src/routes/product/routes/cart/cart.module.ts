import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { OptionsService } from '../options/options.service';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { JwtTokenService } from 'src/routes/auth/services/jwt.service';
import { Option } from '../options/entities/option.entity';
import { ProductService } from '../../product.service';
import { JwtService } from '@nestjs/jwt';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/productImage.entity';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from 'src/routes/category/category.service';
import { AwsService } from 'src/global/aws/aws.service';
import { Brand } from '../brand/entities/brand.entity';
import { Category } from 'src/routes/category/entities/Category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      Members,
      Option,
      Product,
      ProductImage,
      Brand,
      Category,
    ]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    AuthService,
    OptionsService,
    JwtTokenService,
    ProductService,
    JwtService,
    BrandService,
    CategoryService,
    AwsService,
  ],
})
export class CartModule {}
