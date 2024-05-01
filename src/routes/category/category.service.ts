import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/Category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { CategoryException } from './exceptions/category-exceptions';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    private authService: AuthService,
  ) {}

  public async findCategoryByCategoryId(categoryId: number) {
    const category = await this.categoryRepository
      .createQueryBuilder('Category')
      .where('Category.categoryId = :categoryId', { categoryId: categoryId })
      .getOne();
    if (!category) {
      throw new CategoryException(CategoryException.Category_NOT_FOUND);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    await this.authService.adminCheck(userId);
    const category = new Category();
    category.categoryName = createCategoryDto.categoryName;
    category.type = createCategoryDto.type;
    console.log(category);
    if (createCategoryDto.parentsCategoryId) {
      const findCategory = await this.findCategoryByCategoryId(
        createCategoryDto.parentsCategoryId,
      );
      category.parent = findCategory;
    }
    return this.categoryRepository.save(category);
  }

  async findByType(type: string) {
    const categories = await this.categoryRepository
      .createQueryBuilder('Category')
      .where('Category.type = :type', { type })
      .getMany();
    return this.buildCategoryTree(categories);
  }

  private buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<number, Category>();

    categories.forEach((category) => {
      category.children = [];
      categoryMap.set(category.categoryId, category);
    });

    categories.forEach((category) => {
      if (category.parentsCategoryId) {
        const parent = categoryMap.get(category.parentsCategoryId);
        if (parent) {
          parent.children.push(category);
        }
      }
    });

    return categories.filter((category) => category.parentsCategoryId === null);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    await this.authService.adminCheck(userId);
    await this.findCategoryByCategoryId(id);
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number, userId: number) {
    await this.authService.adminCheck(userId);
    await this.findCategoryByCategoryId(id);
    return this.categoryRepository.delete(id);
  }
}
