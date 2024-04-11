import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { ProductsException } from './exceptions/products-exceptions';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private productRepository: Repository<Products>,
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
      throw new ProductsException(
        ProductsException.PRODUCT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    updateProductDto.updated_at = new Date();
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    await this.findProduct(id);
    return await this.productRepository.delete(id);
  }
}
