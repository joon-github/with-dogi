import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { CartService } from '../cart/cart.service';
import { OptionsService } from '../options/options.service';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { JwtTokenService } from 'src/routes/auth/services/jwt.service';
import { Cart } from '../cart/entities/cart.entity';
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
import { OrderItem } from './entities/orderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Members,
      Cart,
      Option,
      Product,
      ProductImage,
      Brand,
      Category,
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    AuthService,
    CartService,
    OptionsService,
    JwtTokenService,
    ProductService,
    JwtService,
    BrandService,
    CategoryService,
    AwsService,
  ],
})
export class OrderModule {}
