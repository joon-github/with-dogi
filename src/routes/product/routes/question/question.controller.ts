import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddQuestionDto } from './dto/AddQuestionDto.dto';
import { QuestionService } from './question.service';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { ProductQuestion } from './entities/productQuestion.entity';

@Controller('product/question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post(':optionId')
  @ApiOperation({ summary: '상품 문의 등록' })
  async addQuestion(
    @Body() addQuestionDto: AddQuestionDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.questionService.addQuestion(addQuestionDto, user.userId);
    return {
      statusCode: 201,
      message: '상품 문의 등록 성공',
      data: null,
    };
  }

  @Get(':productId')
  @ApiOperation({ summary: '상품 문의 조회' })
  async getQuestion(
    @Param('productId') productId: number,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<ProductQuestion[]>> {
    const user = request['user'] as TokenPayload;
    const data: ProductQuestion[] = await this.questionService.getQuestion(
      productId,
      user.userId,
    );
    return {
      statusCode: 200,
      message: `상품 문의 조회 성공`,
      data: data,
    };
  }
}
