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
    const categories = await this.categoriesRepository
      .createQueryBuilder('Categories')
      .where('Categories.category_id = :categori_id', { categori_id })
      .getOne();
    if (!categories) {
      throw new CategoriesException(CategoriesException.Category_NOT_FOUND);
    }
    return categories;
  }

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    await this.authService.adminCheck(userId);
    const category: Categories = {
      categoryName: createCategoryDto.categoryName,
      type: createCategoryDto.type,
    };
    if (createCategoryDto.parentsCategoryId) {
      const findCategory = await this.findCategoriesByCategoriId(
        createCategoryDto.parentsCategoryId,
      );
      category.parent = findCategory;
    }
    return this.categoriesRepository.save(category);
  }

  async findByType(type: string) {
    const queryBuilder = this.categoriesRepository
      .createQueryBuilder('Categories')
      .where('Categories.type = :type', { type });
    return queryBuilder.getMany();
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    await this.authService.adminCheck(userId);
    await this.findCategoriesByCategoriId(id);
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  async remove(id: number, userId: number) {
    await this.authService.adminCheck(userId);
    await this.findCategoriesByCategoriId(id);
    return this.categoriesRepository.delete(id);
  }
}
