import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/Categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthException } from 'src/auth/exceptions/auth-exceptions';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,

    private authService: AuthService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user_id: number) {
    const user = await this.authService.findUserById(user_id);
    if (user.role !== 'admin') {
      throw new AuthException(AuthException.IS_NOT_AUTHORIZED);
    }
    return this.categoriesRepository.save(createCategoryDto);
  }

  findAll() {
    const queryBuilder =
      this.categoriesRepository.createQueryBuilder('Categories');
    return queryBuilder.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
