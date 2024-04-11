import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { ProductsException } from './exceptions/products-exceptions';
import { Request } from 'express';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthException } from 'src/auth/exceptions/auth-exceptions';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private productRepository: Repository<Products>,

    private readonly authService: AuthService,
  ) {}

  private getProducts() {
    return this.productRepository
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
  }

  private async findProduct(id: number) {
    const product = await this.getProducts()
      .where('Products.product_id = :id', { id }) // :id는 매개변수로 전달받은 상품 ID
      .getOne(); // 단일 결과 반환

    if (!product) {
      throw new ProductsException(ProductsException.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  private async verifyProductOwner(
    id: number,
    request: Request,
  ): Promise<void> {
    const payload = request['user'] as TokenPayload;
    const findUser = await this.authService.findUserByEmail(payload.email);
    const findProduct = await this.findProduct(id);
    if (findUser.user_id !== findProduct.brand.user.user_id) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }
  }

  async create(createProductDto: CreateProductDto, request: Request) {
    const payload = request['user'] as TokenPayload;
    const findUser = await this.authService.findUserByEmail(payload.email);
    if (findUser.role === 'user') {
      throw new AuthException(AuthException.IS_NOT_AUTHORIZED);
    }
    return this.productRepository.save(createProductDto);
  }

  async findAll() {
    const products = await this.getProducts().getMany();
    return products;
  }

  async findOne(id: number) {
    const product = await this.findProduct(id);
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    request: Request,
  ) {
    await this.verifyProductOwner(id, request);
    updateProductDto.updated_at = new Date();
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number, request: Request) {
    await this.verifyProductOwner(id, request);
    return await this.productRepository.delete(id);
  }
}
