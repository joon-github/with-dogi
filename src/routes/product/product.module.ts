import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { Brand } from 'src/routes/product/routes/brand/entities/brand.entity';
import { BrandService } from 'src/routes/product/routes/brand/brand.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/Category.entity';
import { ProductImage } from './entities/productImage.entity';
import { AwsService } from 'src/global/aws/aws.service';
import { OptionsService } from './routes/options/options.service';
import { Option } from './routes/options/entities/option.entity';
import { OptionsModule } from './routes/options/options.module';
import { QuestionModule } from './routes/question/question.module';
import { CartModule } from './routes/cart/cart.module';
import { AnwserModule } from './routes/answer/answer.module';
import { OrderModule } from './routes/order/order.module';
import { AuthModule } from '../auth/auth.module';
import { ReviewModule } from './routes/review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Members,
      Brand,
      Category,
      ProductImage,
      Option,
    ]),
    OptionsModule,
    QuestionModule,
    CartModule,
    AnwserModule,
    OrderModule,
    AuthModule,
    ReviewModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    BrandService,
    CategoryService,
    AwsService,
    OptionsService,
  ],
})
export class ProductModule {}
