import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from './entities/review.entity';
import { Repository } from 'typeorm';
import { AddReviewDto } from './dto/addProductReviewDto.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
  ) {}

  async addReview(
    addOptionForProductDto: AddReviewDto,
    userId: number,
  ): Promise<void> {
    // 구매 api 만들고
    console.log(addOptionForProductDto, userId);
  }
}
