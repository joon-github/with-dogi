import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from './entities/review.entity';
import { Repository } from 'typeorm';
import { AddReviewDto } from './dto/addProductReviewDto.dto';
import { OrderService } from '../order/order.service';
import { AuthService } from 'src/routes/auth/services/auth.service';

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
    
    const user = await this.authService.findUserById(userId);
    const orderItem =
      await this.orderService.checkSalesHistoryWithUserIdAndorderDetailId(
        userId,
        addOptionForProductDto.orderDetailId,
      );


    await this.reviewRepository.save(review);
  }
}
