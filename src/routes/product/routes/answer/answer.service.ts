import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductAnswer } from './entities/productAnswer.entity';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { ProductService } from '../../product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionService } from '../question/question.service';
import { AddAnswerDto } from './dto/AddAnswerDto.dto';
import { ProductException } from '../../exceptions/product-exceptions';
import { UpdateAnswerDto } from './dto/UpdateAnswerDot.dto';
import { AnswerException } from './exceptions/answer-exceptions';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(ProductAnswer)
    private productAnswerRepository: Repository<ProductAnswer>,

    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly questionService: QuestionService,
  ) {}
  private async answerOwnerCheck(answerId: number, userId: number) {
    const answer = await this.productAnswerRepository.findOne({
      where: { answerId: answerId },
      relations: ['question', 'user'],
    });
    if (!answer) {
      throw new AnswerException(AnswerException.ANSWER_NOT_FOUND);
    }
    if (answer.user.userId !== userId) {
      throw new AnswerException(AnswerException.NOT_ANSWER_OWNER);
    }
    return answer;
  }

  private async productOwnerCheck(questionId: number, userId: number) {
    const productId =
      await this.questionService.findProductIdByQuestionId(questionId);
    const isOwner = await this.productService.isProductOwner(productId, userId);
    if (!isOwner) {
      throw new ProductException(ProductException.NOT_PRODUCT_OWNER);
    }
  }
  async addAnswer(
    questionId: number,
    addAnswerDto: AddAnswerDto,
    userId: number,
  ) {
    await this.productOwnerCheck(questionId, userId);

    const answer = new ProductAnswer();
    answer.user = await this.authService.findUserById(userId);
    answer.question =
      await this.questionService.findQuestionByQuestionId(questionId);
    answer.answerContent = addAnswerDto.answerContent;

    return await this.productAnswerRepository.save(answer);
  }

  async updateAnswer(
    answerId: number,
    updateAnswerDto: UpdateAnswerDto,
    userId: number,
  ) {
    await this.answerOwnerCheck(answerId, userId);
    return await this.productAnswerRepository.update(answerId, updateAnswerDto);
  }

  async deleteAnswer(answerId: number, userId: number) {
    await this.answerOwnerCheck(answerId, userId);
    return await this.productAnswerRepository.delete(answerId);
  }
}
