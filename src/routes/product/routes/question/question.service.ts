import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductQuestion } from './entities/productQuestion.entity';
import { Repository } from 'typeorm';
import { AddQuestionDto } from './dto/AddQuestionDto.dto';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { OptionsService } from '../options/options.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(ProductQuestion)
    private productQuestionRepository: Repository<ProductQuestion>,

    private readonly authService: AuthService,
    private readonly optionsService: OptionsService,
  ) {}

  async addQuestion(addQuestionDto: AddQuestionDto, userId: number) {
    const findUser = await this.authService.findUserById(userId);
    const option = await this.optionsService.findOptionByOptionId(
      addQuestionDto.optionId,
    );
    const question = new ProductQuestion();

    question.user = findUser;
    question.option = option;
    question.questionTitle = addQuestionDto.questionTitle;
    question.questionContent = addQuestionDto.questionContent;

    await this.productQuestionRepository.save(question);
  }

  async getQuestion(productId: number, userId: number) {
    const queryBuilder = this.productQuestionRepository
      .createQueryBuilder('ProductQuestion')
      .leftJoin('ProductQuestion.user', 'User')
      .leftJoin('ProductQuestion.option', 'Option')
      .leftJoin('Option.product', 'Product')
      .where('Product.productId = :productId', { productId })
      .andWhere('User.userId = :userId', { userId });

    const question = await queryBuilder.getMany();

    return question;
  }
}
