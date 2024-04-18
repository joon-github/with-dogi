import { Module } from '@nestjs/common';
import { AnswerController } from './asnwer.controller';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAnswer } from './entities/productAnswer.entity';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { AuthModule } from 'src/routes/auth/auth.module';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { ProductService } from '../../product.service';
import { QuestionService } from '../question/question.service';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/productImage.entity';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from 'src/routes/category/category.service';
import { AwsService } from 'src/global/aws/aws.service';
import { ProductQuestion } from '../question/entities/productQuestion.entity';
import { OptionsService } from '../options/options.service';
import { Brand } from '../brand/entities/brand.entity';
import { Category } from 'src/routes/category/entities/Category.entity';
import { Option } from '../options/entities/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductAnswer,
      Members,
      Product,
      ProductImage,
      ProductQuestion,
      Brand,
      Category,
      Option,
    ]),
    AuthModule,
  ],
  controllers: [AnswerController],
  providers: [
    AnswerService,
    AuthService,
    ProductService,
    QuestionService,
    BrandService,
    CategoryService,
    AwsService,
    OptionsService,
  ],
  exports: [],
})
export class AnwserModule {}
