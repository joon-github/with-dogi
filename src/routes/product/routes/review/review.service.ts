import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from './entities/review.entity';
import { Repository } from 'typeorm';
import { AddReviewDto } from './dto/addProductReviewDto.dto';
import { OrderService } from '../order/order.service';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { ReviewException } from './exceptions/question-exceptions';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,

    private readonly orderService: OrderService,

    private readonly authService: AuthService,
  ) {}

  async addReview(
    addOptionForProductDto: AddReviewDto,
    userId: number,
  ): Promise<void> {
    const savedData = await this.reviewRepository
      .createQueryBuilder('ProductReview')
      .leftJoinAndSelect('ProductReview.orderItem', 'orderItem')
      .where('orderItem.orderDetailId = :orderDetailId', {
        orderDetailId: addOptionForProductDto.orderDetailId,
      })
      .andWhere('ProductReview.userId = :userId', { userId })
      .getOne();
    console.log(savedData);
    if (savedData) {
      throw new ReviewException(ReviewException.REVIEW_ALREADY_WRITTEN);
    }
    const user = await this.authService.findUserById(userId);
    const orderItem =
      await this.orderService.checkSalesHistoryWithUserIdAndorderDetailId(
        userId,
        addOptionForProductDto.orderDetailId,
      );
    const review = new ProductReview();
    review.user = user;
    review.orderItem = orderItem;
    review.rating = addOptionForProductDto.rating;
    review.comment = addOptionForProductDto.comment;

    await this.reviewRepository.save(review);
  }
}
