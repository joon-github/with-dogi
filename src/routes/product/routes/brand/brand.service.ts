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
      .where('brandId = :id', { id })
      .select(['Brand', 'Members.userId'])
      .getOne();

    if (!brand) {
      throw new BrandException(BrandException.BRAND_NOT_FOUND);
    }
    return brand;
  }

  public async checkBrandOwner(id: number, userId: number) {
    const findUser = await this.authService.findUserById(userId);
    const findBrand = await this.findBrandById(id);
    if (findUser.userId !== findBrand.user.userId) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }
    return findBrand;
  }

  async create(createBrandDto: CreateBrandDto, userId: number) {
    const findUser = await this.authService.findUserById(userId);
    const brand = {
      ...createBrandDto,
      user: findUser,
    };
    return await this.brandRepository.save(brand);
  }

  async findAll(brandName: string, userId: number) {
    const queryBuilder = this.brandRepository.createQueryBuilder('Brand');
    const where = {};
    const like = {};
    if (userId) {
      where['userId'] = userId;
    }
    if (brandName) {
      like['brandName'] = brandName;
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

  async update(id: number, updateBrandDto: UpdateBrandDto, userId: number) {
    await this.checkBrandOwner(id, userId);
    return await this.brandRepository.update(id, updateBrandDto);
  }

  async remove(id: number, userId: number) {
    await this.checkBrandOwner(id, userId);
    return await this.brandRepository.delete(id);
  }
}
