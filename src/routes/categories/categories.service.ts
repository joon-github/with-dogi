import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/Categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { CategoriesException } from './exceptions/categories-exceptions';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,

    private authService: AuthService,
  ) {}

  public async findCategoriesByCategoriId(categori_id: number) {
    const categories = this.categoriesRepository
      .createQueryBuilder('Categories')
      .where('Categories.category_id = :categori_id', { categori_id })
      .getOne();
    if (!categories) {
      throw new CategoriesException(CategoriesException.Category_NOT_FOUND);
    }
    return categories;
  }

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
    await this.findCategoriesByCategoriId(id);
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  async remove(id: number, user_id: number) {
    await this.authService.adminCheck(user_id);
    await this.findCategoriesByCategoriId(id);
    return this.categoriesRepository.delete(id);
  }
}
