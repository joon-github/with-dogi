import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { AddReviewDto } from './dto/addProductReviewDto.dto';

@Controller('product/review')
@ApiTags('option')
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
}
