import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/Categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/routes/auth/services/auth.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,

    private authService: AuthService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user_id: number) {
    await this.authService.adminCheck(user_id);
    return this.categoriesRepository.save(createCategoryDto);
  }

  findAll() {
    const queryBuilder =
      this.categoriesRepository.createQueryBuilder('Categories');
    return queryBuilder.getMany();
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    user_id: number,
  ) {
    await this.authService.adminCheck(user_id);
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  async remove(id: number, user_id: number) {
    await this.authService.adminCheck(user_id);
    return this.categoriesRepository.delete(id);
  }
}
