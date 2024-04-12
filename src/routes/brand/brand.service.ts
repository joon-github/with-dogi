import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { AuthException } from 'src/routes/auth/exceptions/auth-exceptions';
import { BrandException } from './exceptions/brand-exceptions';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,

    private authService: AuthService,
  ) {}

  public async findBrandById(id: number) {
    const brand = await this.brandRepository
      .createQueryBuilder('Brand')
      .leftJoinAndSelect('Brand.user', 'Members')
      .where('brand_id = :id', { id })
      .select(['Brand', 'Members.user_id'])
      .getOne();

    if (!brand) {
      throw new BrandException(BrandException.BRAND_NOT_FOUND);
    }
    return brand;
  }

  public async checkBrandOwner(id: number, user_id: number) {
    const findUser = await this.authService.findUserById(user_id);
    const findBrand = await this.findBrandById(id);
    if (findUser.user_id !== findBrand.user.user_id) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }
    return findBrand;
  }

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

  async update(id: number, updateBrandDto: UpdateBrandDto, user_id: number) {
    await this.checkBrandOwner(id, user_id);
    return await this.brandRepository.update(id, updateBrandDto);
  }

  async remove(id: number, user_id: number) {
    await this.checkBrandOwner(id, user_id);
    return `This action removes a #${id} brand`;
  }
}
