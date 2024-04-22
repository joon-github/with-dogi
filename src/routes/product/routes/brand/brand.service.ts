import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { AuthException } from 'src/routes/auth/exceptions/auth-exceptions';
import { BrandException } from './exceptions/brand-exceptions';
// import { OrderService } from '../order/order.service';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,

    private authService: AuthService,
    // private orderService: OrderService,
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

  public async checkBrandOwner(brandId: number, userId: number) {
    const findUser = await this.authService.findUserById(userId);
    const findBrand = await this.findBrandById(brandId);
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

  async findAll(userId: number) {
    const brandList = this.brandRepository
      .createQueryBuilder('Brand')
      .leftJoin('Brand.user', 'Members')
      .where('Members.userId = :userId', { userId: userId })
      .getMany();
    return brandList;
  }

  async update(
    brandId: number,
    updateBrandDto: UpdateBrandDto,
    userId: number,
  ) {
    await this.checkBrandOwner(brandId, userId);
    // await this.orderService.checkSalesHistoryWithbrandId(brandId);
    return await this.brandRepository.update(brandId, updateBrandDto);
  }

  async remove(brandId: number, userId: number) {
    await this.checkBrandOwner(brandId, userId);
    // await this.orderService.checkSalesHistoryWithbrandId(brandId);
    return await this.brandRepository.delete(brandId);
  }
}
