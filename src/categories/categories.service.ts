import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/Categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BrandService } from 'src/brand/brand.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,

    private readonly brandService: BrandService,
  ) {}

  private getCategories(): SelectQueryBuilder<Categories> {
    const queryBuilder = this.categoriesRepository
      .createQueryBuilder('Categories')
      .leftJoinAndSelect('Categories.brand', 'Brand')
      .leftJoinAndSelect('Brand.user', 'Members')
      .select(['Categories', 'Brand', 'Members.name', 'Members.user_id']);
    return queryBuilder;
  }
  async create(createCategoryDto: CreateCategoryDto, user_id: number) {
    const brand = await this.brandService.checkBrandOwner(
      createCategoryDto.brand_id,
      user_id,
    );
    const category = {
      ...createCategoryDto,
      brand,
    };
    return this.categoriesRepository.save(category);
  }

  findAll(category_name: string, user_id: number) {
    const queryBuilder = this.getCategories();
    if (category_name) {
      queryBuilder.where(`Categories.category_name = :category_name`, {
        category_name,
      });
    }
    if (user_id) {
      queryBuilder.where(`Brand.user_id = :user_id`, { user_id });
    }
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
