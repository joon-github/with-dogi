import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { AddAnswerDto } from './dto/AddAnswerDto.dto';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { UpdateAnswerDto } from './dto/UpdateAnswerDot.dto';

@Controller('product/answer')
@ApiTags('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post(':questionId')
  @ApiOperation({ summary: '문의 답변 등록' })
  async addAnswer(
    @Param('questionId') questionId: number,
    @Body() addAnswerDto: AddAnswerDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.answerService.addAnswer(questionId, addAnswerDto, user.userId);
    return {
      statusCode: 201,
      message: '문의 답변 등록 성공',
      data: null,
    };
  }

  @Patch(':answerId')
  @ApiOperation({ summary: '문의 답변 수정' })
  async updateAnswer(
    @Param('answerId') answerId: number,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.answerService.updateAnswer(
      answerId,
      updateAnswerDto,
      user.userId,
    );
    return {
      statusCode: 200,
      message: '문의 답변 수정 성공',
      data: null,
    };
  }

  @Delete()
  @ApiOperation({ summary: '문의 답변 삭제' })
  async deleteAnswer(
    @Param('answerId') answerId: number,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.answerService.deleteAnswer(answerId, user.userId);
    return {
      statusCode: 200,
      message: '문의 답변 삭제 성공',
      data: null,
    };
  }
}
