import { Module } from '@nestjs/common';
import { AnswerController } from './asnwer.controller';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAnswer } from './entities/productAnswer.entity';
import { ProductDependenciesModule } from '../../productDependencies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductAnswer]),
    ProductDependenciesModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnwserModule {}
