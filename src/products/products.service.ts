import { Injectable } from '@nestjs/common';
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

  create(createProductDto: CreateProductDto) {
    console.log(createProductDto);
    return 'This action adds a new product';
  }

  async findAll() {
    /**
     select Products.*,Brand.brand_name from Products as Products left join Brand as Brand on Products.brand_id = Brand.brand_id
     
     */
    const products = await this.productRepository
      .createQueryBuilder('Products') // 'Products' 테이블에 대한 별칭 설정
      // .leftJoinAndSelect('Products.brand', 'Brand') // 'Brand'와 LEFT JOIN
      // .leftJoinAndSelect('Brand.members', 'Members') // 'Member'와 LEFT JOIN, 이 부분은 Brand 엔티티 내에 Member 엔티티와의 관계를 설정해야 합니다.
      .select([
        'Products', // Products 테이블의 모든 컬럼
        // 'Brand.brand_name', // Brand 테이블의 brand_name 컬럼
        // 'Members.name', // Member 테이블의 name 컬럼
      ])
      .getMany();
    // 여러 결과를 반환받습니다.

    return products; // 또는 getOne()을 사용할 수 있습니다.
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
