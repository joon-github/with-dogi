import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from './entities/review.entity';
import { Repository } from 'typeorm';
import { AddReviewDto } from './dto/addProductReviewDto.dto';
import { OrderService } from '../order/order.service';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { ReviewException } from './exceptions/question-exceptions';
import { likeProductReview } from './entities/likeReview.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,

    @InjectRepository(likeProductReview)
    private readonly likeReviewRepository: Repository<likeProductReview>,

    private readonly orderService: OrderService,

    private readonly authService: AuthService,
  ) {}

  async addReview(
    addOptionForProductDto: AddReviewDto,
    userId: number,
  ): Promise<void> {
    const savedData = await this.reviewRepository
      .createQueryBuilder('ProductReview')
      .leftJoin('ProductReview.orderItem', 'orderItem')
      .where('orderItem.orderDetailId = :orderDetailId', {
        orderDetailId: addOptionForProductDto.orderDetailId,
      })
      .andWhere('ProductReview.userId = :userId', { userId })
      .getOne();
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

  async getReview(productId: number): Promise<ProductReview[]> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('ProductReview')
      .leftJoin('ProductReview.user', 'Members')
      .leftJoin('ProductReview.orderItem', 'OrderItem')
      .leftJoin('OrderItem.option', 'Option')
      .leftJoinAndSelect('Option.product', 'Product')
      .leftJoinAndSelect('ProductReview.likeReview', 'LikeProductReview') // 리뷰 좋아요 테이블과 조인
      .select([
        'ProductReview', // 모든 ProductReview 필드 선택
        'LikeProductReview',
        'Members.name', // 회원 이름 선택
        'Product.productName',
      ])
      .where('Product.productId = :productId', { productId })
      .getMany();

    return reviews;
  }

  async toggleLike(reviewId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { reviewId },
    });
    if (!review) {
      throw new ReviewException(ReviewException.REVIEW_NOT_FOUND);
    }
    const user = await this.authService.findUserById(userId);

    const like = await this.likeReviewRepository
      .createQueryBuilder('LikeProductReview')
      .where('LikeProductReview.reviewId = :reviewId', { reviewId })
      .andWhere('LikeProductReview.userId = :userId', { userId })
      .getOne();

    if (like) {
      await this.likeReviewRepository.remove(like);
    } else {
      const like = new likeProductReview();
      like.user = user;
      like.review = review;
      await this.likeReviewRepository.save(like);
    }
  }
}
