import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductException } from './exceptions/product-exceptions';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { AuthException } from 'src/routes/auth/exceptions/auth-exceptions';
import { v4 as uuidv4 } from 'uuid';
import { BrandService } from 'src/routes/brand/brand.service';
import { CategoryService } from '../category/category.service';
import { Option } from './options/entities/option.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    private readonly authService: AuthService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private dataSource: DataSource,
  ) {}

  private getProduct(): SelectQueryBuilder<Product> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('Product')
      .leftJoinAndSelect('Product.brand', 'Brand')
      .leftJoinAndSelect('Brand.user', 'Members')
      .leftJoinAndSelect('Product.category', 'Category')
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
      .where(`Product.productId = :id`, { id })
      .getOne();
    if (!product) {
      throw new ProductException(ProductException.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  public async checkProductOwner(productId: number, userId: number) {
    const findUser = await this.authService.findUserById(userId);
    const findProduct = await this.findProduct(productId);
    if (findUser.userId !== findProduct.brand.user.userId) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }
    return findProduct;
  }

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const findUser = await this.authService.findUserById(userId);
      if (findUser.role === 'user') {
        throw new AuthException(AuthException.IS_NOT_AUTHORIZED);
      }
      const brand = await this.brandService.checkBrandOwner(
        createProductDto.brandId,
        userId,
      );
      const category = await this.categoryService.findCategoryByCategoryId(
        createProductDto.categoryId,
      );

      const product = new Product();
      product.productName = createProductDto.productName;
      product.price = createProductDto.price;
      product.description = createProductDto.description;
      product.productCode = uuidv4();
      product.brand = brand;
      product.category = category;

      const savedProduct = await queryRunner.manager.save(product);

      createProductDto.options.forEach(async (option) => {
        const optionEntity = new Option();

        optionEntity.optionName = option.optionName;
        optionEntity.product = savedProduct;
        optionEntity.addPrice = option.addPrice;
        optionEntity.stock = option.stock;

        await queryRunner.manager.save(optionEntity);
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('실패?');
      await queryRunner.rollbackTransaction();
      throw new ProductException(ProductException.PRODUCT_CREATE_FAIL);
    } finally {
      await queryRunner.release();
    }
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

  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    await this.checkProductOwner(id, userId);
    updateProductDto.updatedAt = new Date();
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number, userId: number) {
    await this.checkProductOwner(id, userId);
    return await this.productRepository.delete(id);
  }
}
