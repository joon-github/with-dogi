import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { ProductsException } from './exceptions/products-exceptions';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthException } from 'src/auth/exceptions/auth-exceptions';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private productRepository: Repository<Products>,

    private readonly authService: AuthService,
  ) {}

  private getProducts<T>(where: T) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('Products')
      .leftJoinAndSelect('Products.brand', 'Brand')
      .leftJoinAndSelect('Brand.user', 'Members')
      .leftJoinAndSelect('Products.category_detail', 'CategoriesDetail')
      .leftJoinAndSelect('CategoriesDetail.category', 'Categories')
      .select([
        'Products',
        'Brand',
        'Members.name',
        'Members.user_id',
        'CategoriesDetail',
        'Categories',
      ]);

    if (where) {
      Object.entries(where).forEach(([key, value]) => {
        queryBuilder.andWhere(`${key} = :value`, { value });
      });
    }

    return queryBuilder;
  }

  private async findProduct(id: number) {
    const product = await this.getProducts({
      'Products.product_id': id,
    }).getOne(); // 단일 결과 반환
    if (!product) {
      throw new ProductsException(ProductsException.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  private async checkProductOwner(id: number, email: string): Promise<void> {
    const findUser = await this.authService.findUserByEmail(email);
    const findProduct = await this.findProduct(id);
    if (findUser.user_id !== findProduct.brand.user.user_id) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }
  }

  async create(createProductDto: CreateProductDto, email: string) {
    try {
      const findUser = await this.authService.findUserByEmail(email);
      if (findUser.role === 'user') {
        throw new AuthException(AuthException.IS_NOT_AUTHORIZED);
      }
      return this.productRepository.save(createProductDto);
    } catch (e) {
      console.log('e,', e);
    }
  }

  async findAll(
    user_id: number,
    category_detail_id: number,
    category_id: number,
  ) {
    const where = {};
    if (user_id) {
      where['Members.user_id'] = user_id;
    }
    if (category_detail_id) {
      where['CategoriesDetail.category_detail_id'] = category_detail_id;
    }
    if (category_id) {
      where['Categories.category_id'] = category_id;
    }
    const products = await this.getProducts(where).getMany();
    return products;
  }

  async findOne(id: number) {
    const product = await this.findProduct(id);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, email: string) {
    await this.checkProductOwner(id, email);
    updateProductDto.updated_at = new Date();
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number, email: string) {
    await this.checkProductOwner(id, email);
    return await this.productRepository.delete(id);
  }
}
