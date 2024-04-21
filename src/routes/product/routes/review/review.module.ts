import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ProductDependenciesModule } from '../../productDependencies.module';

@Module({
  imports: [ProductDependenciesModule],
  controllers: [ReviewController],
})
export class ReviewModule {}
