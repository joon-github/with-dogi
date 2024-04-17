import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductException } from './exceptions/product-exceptions';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { AuthException } from 'src/routes/auth/exceptions/auth-exceptions';
import { v4 as uuidv4 } from 'uuid';
import { BrandService } from 'src/routes/brand/brand.service';
import { CategoryService } from '../category/category.service';
import { Option } from './routes/options/entities/option.entity';
import { AwsService } from 'src/global/aws/aws.service';
import { ProductImage } from './entities/productImage.entity';
import { ImageInfo } from './dto/ImageInfo';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    public productImageRepository: Repository<ProductImage>,

    private readonly authService: AuthService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly awsService: AwsService,
    private dataSource: DataSource,
  ) {}

  private getProduct(
    limit?: number,
    offset?: number,
  ): SelectQueryBuilder<Product> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('Product')
      .leftJoin('Product.brand', 'Brand')
      .leftJoin('Brand.user', 'Members')
      .leftJoin('Product.category', 'Category')
      .leftJoin('Product.options', 'Option')
      .leftJoin('Product.images', 'ProductImage')
      .select([
        'Product',
        'Brand',
        'Members.name',
        'Members.userId',
        'Category',
        'Option',
        'ProductImage',
      ]);

    if (limit) {
      queryBuilder.limit(limit);
    }
    if (offset) {
      queryBuilder.offset((offset - 1) * limit); // 올바른 오프셋 계산
    }
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
    images: ImageInfo[],
  ): Promise<Product> {
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

      for (const option of createProductDto.options) {
        const optionEntity = new Option();

        optionEntity.optionName = option.optionName;
        optionEntity.product = savedProduct;
        optionEntity.addPrice = option.addPrice;
        optionEntity.stock = option.stock;

        await queryRunner.manager.save(optionEntity);
      }
      if (images) {
        for (const image of images) {
          const url = await this.awsService.imageUpload(image.file);
          const productImage = new ProductImage();
          productImage.product = product;
          productImage.imageName = image.imageName;
          productImage.type = image.type;
          productImage.imageUrl = url.imageUrl;
          await queryRunner.manager.save(productImage);
        }
      }
      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (err) {
      console.log('실패?', err);
      await queryRunner.rollbackTransaction();
      throw err;
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
    const queryBuilder = this.getProduct(limit, offset);
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

    const [product, total] = await queryBuilder.getManyAndCount();

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