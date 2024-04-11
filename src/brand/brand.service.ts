import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,

    private authService: AuthService,
  ) {}

  async create(createBrandDto: CreateBrandDto, user_id: number) {
    const findUser = await this.authService.findUserById(user_id);
    const brand = {
      ...createBrandDto,
      user: findUser,
    };
    return await this.brandRepository.save(brand);
  }

  async findAll(brand_name: string, user_id: number) {
    const queryBuilder = this.brandRepository.createQueryBuilder('Brand');
    const where = {};
    const like = {};
    if (user_id) {
      where['user_id'] = user_id;
    }
    if (brand_name) {
      like['brand_name'] = brand_name;
    }
    Object.entries(where).forEach(([key, value]) => {
      queryBuilder.andWhere(`${key} = :value`, { value });
    });
    Object.entries(like).forEach(([key, value]) => {
      queryBuilder.andWhere(`${key} LIKE :value`, { value: `%${value}%` });
    });
    const brandList = await queryBuilder.getMany();
    return brandList;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    console.log(updateBrandDto);
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
