import { Injectable } from '@nestjs/common';
import { CreateDetailDto } from './dto/create-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { AuthService } from 'src/routes/Common/auth/services/auth.service';
import { CategoriesDetail } from './entities/CategoriesDetail.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from '../categories.service';

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(CategoriesDetail)
    private categoriesDetailRepository: Repository<CategoriesDetail>,

    private authService: AuthService,
    private categoriesService: CategoriesService,
  ) {}
  async create(createDetailDto: CreateDetailDto, user_id: number) {
    await this.authService.adminCheck(user_id);
    return this.categoriesDetailRepository.save(createDetailDto);
  }

  async findDetailByCategory(category_id: number, user_id: number) {
    await this.authService.adminCheck(user_id);
    await this.categoriesService.findCategoriesByCategoriId(category_id);
    return this.categoriesDetailRepository
      .createQueryBuilder('CategoriesDetail')
      .where('CategoriesDetail.category_id = :category_id', { category_id })
      .getMany();
  }

  update(id: number, updateDetailDto: UpdateDetailDto) {
    console.log(updateDetailDto);
    return `This action updates a #${id} detail`;
  }

  remove(id: number) {
    return `This action removes a #${id} detail`;
  }
}
