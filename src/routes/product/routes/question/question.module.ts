import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductQuestion } from './entities/productQuestion.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { AuthModule } from 'src/routes/auth/auth.module';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { OptionsService } from '../options/options.service';
import { Option } from '../options/entities/option.entity';
import { OptionsModule } from '../options/options.module';
import { ProductService } from '../../product.service';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/productImage.entity';
import { Brand } from 'src/routes/brand/entities/brand.entity';
import { Category } from 'src/routes/category/entities/Category.entity';
import { BrandService } from 'src/routes/brand/brand.service';
import { CategoryService } from 'src/routes/category/category.service';
import { AwsService } from 'src/global/aws/aws.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Members,
      Option,
      ProductQuestion,
      Product,
      ProductImage,
      Brand,
      Brand,
      Category,
    ]),
    AuthModule,
    OptionsModule,
  ],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    AuthService,
    OptionsService,
    ProductService,
    BrandService,
    CategoryService,
    AwsService,
  ],
})
export class QuestionModule {}
