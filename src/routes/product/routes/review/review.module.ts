import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
