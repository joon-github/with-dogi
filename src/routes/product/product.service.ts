import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductException } from './exceptions/product-exceptions';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { AuthException } from 'src/routes/auth/exceptions/auth-exceptions';
import { v4 as uuidv4 } from 'uuid';
import { BrandService } from 'src/routes/brand/brand.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    private readonly authService: AuthService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {}

  private getProduct(): SelectQueryBuilder<Product> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('Product')
      .leftJoinAndSelect('Product.brand', 'Brand')
      .leftJoinAndSelect('Brand.user', 'Members')
      .leftJoinAndSelect('CategoryDetail.category', 'Category')
      .select([
        'Product',
        'Brand',
        'Members.name',
        'Members.userId',
        'Category',
      ]);
    return queryBuilder;
  }

  private async findProduct(id: number) {
    const product = await this.getProduct()
      .where(`Product.product_id = :id`, { id })
      .getOne();
    if (!product) {
      throw new ProductException(ProductException.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  private async checkProductOwner(id: number, email: string): Promise<void> {
    const findUser = await this.authService.findUserByEmail(email);
    const findProduct = await this.findProduct(id);
    if (findUser.userId !== findProduct.brand.user.userId) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }
  }

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<void> {
    const findUser = await this.authService.findUserById(userId);
    if (findUser.role === 'user') {
      throw new AuthException(AuthException.IS_NOT_AUTHORIZED);
    }
    const brand = await this.brandService.checkBrandOwner(
      createProductDto.brandId,
      userId,
    );
    const category = await this.categoryService.findCategoryByCategoriId(
      createProductDto.categoryId,
    );

    const productCode = uuidv4();
    const product: Product = {
      productName: createProductDto.productName,
      price: createProductDto.price,
      description: createProductDto.description,
      productCode: productCode,
      brand: brand,
      category: category,
    };
    await this.productRepository.save(product);
  }

  async findAll(
    userId: number,
    categoryId: number,
    productCode: string,
    limit: number,
    offset: number,
  ) {
    const queryBuilder = this.getProduct();
    const where = {};
    const like = {};
    if (userId) {
      where['Members.userId'] = userId;
    }
    if (categoryId) {
      where['Category.categoryId'] = categoryId;
    }

    if (productCode) {
      like['Product.productCode'] = productCode;
    }
    Object.entries(where).forEach(([key, value]) => {
      queryBuilder.andWhere(`${key} = :value`, { value });
    });
    Object.entries(like).forEach(([key, value]) => {
      queryBuilder.andWhere(`${key} LIKE :value`, { value: `%${value}%` });
    });

    queryBuilder.skip(offset);
    queryBuilder.take(limit);
    const [product, total] = await queryBuilder.getManyAndCount();
    // const data = await queryBuilder.getMany();

    return {
      total,
      product,
    };
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
