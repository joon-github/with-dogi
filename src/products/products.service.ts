import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entities/products.entity';

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

  async create(createProductDto: CreateProductDto) {
    console.log(createProductDto);
  }

  async findAll() {
    const products = await this.getProducts().getMany();
    return products;
  }

  async findOne(id: number) {
    try {
      const product = await this.getProducts()
        .where('Products.product_id = :id', { id }) // :id는 매개변수로 전달받은 상품 ID
        .getOne(); // 단일 결과 반환

      if (!product) {
        throw new HttpException(
          `Product with ID ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return product;
    } catch (e) {
      throw e;
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
