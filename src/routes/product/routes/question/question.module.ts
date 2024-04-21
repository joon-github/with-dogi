import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { ProductModule } from '../../product.module';

@Module({
  imports: [ProductModule],
  controllers: [QuestionController],
})
export class QuestionModule {}
