import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { ProductDependenciesModule } from '../../productDependencies.module';

@Module({
  imports: [ProductDependenciesModule],
  controllers: [QuestionController],
})
export class QuestionModule {}
