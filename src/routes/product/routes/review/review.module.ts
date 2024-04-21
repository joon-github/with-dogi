import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview } from './entities/review.entity';
import { ProductModule } from '../../product.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview]), ProductModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
