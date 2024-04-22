import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { AddReviewDto } from './dto/addProductReviewDto.dto';
import { ProductReview } from './entities/review.entity';

@Controller('product/review')
@ApiTags('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: '상품 리뷰 추가' })
  async addReview(
    @Body() addOptionForProductDto: AddReviewDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.reviewService.addReview(addOptionForProductDto, user.userId);
    return {
      statusCode: 201,
      message: '옵션 추가 성공',
      data: null,
    };
  }

  @Get(':productId')
  @ApiOperation({ summary: '상품 리뷰 조회' })
  async getReview(
    @Param('productId') productId: number,
  ): Promise<ResponesContainerDto<ProductReview[]>> {
    const data = await this.reviewService.getReview(productId);
    return {
      statusCode: 200,
      message: '옵션 조회 성공',
      data: data,
    };
  }

  @Post(':reviewId/toggle-like')
  @ApiOperation({ summary: '리뷰 좋아요 토글' })
  async toggleLike(
    @Param('reviewId') reviewId: number,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.reviewService.toggleLike(reviewId, user.userId);
    return {
      statusCode: 200,
      message: '좋아요 토글 성공',
      data: null,
    };
  }
}
