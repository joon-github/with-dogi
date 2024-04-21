import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
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
import { OptionsService } from './routes/options/options.service';
import { Option } from './routes/options/entities/option.entity';
import { QuestionService } from './routes/question/question.service';
import { ProductQuestion } from './routes/question/entities/productQuestion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Members,
      Brand,
      Category,
      ProductImage,
      Option,
      ProductQuestion,
    ]),
    AuthModule,
  ],
  providers: [
    ProductService,
    BrandService,
    CategoryService,
    AwsService,
    OptionsService,
    QuestionService,
  ],
  exports: [
    ProductService,
    BrandService,
    CategoryService,
    AwsService,
    AuthModule,
    OptionsService,
    QuestionService,
    TypeOrmModule.forFeature([
      Product,
      Members,
      Brand,
      Category,
      ProductImage,
      Option,
      ProductQuestion,
    ]),
  ],
})
export class ProductDependenciesModule {}
