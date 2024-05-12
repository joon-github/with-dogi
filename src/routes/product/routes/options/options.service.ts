import { Injectable } from '@nestjs/common';
import { AddOptionForProductDto } from './dto/addOptionForProductDto.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductService } from '../../product.service';
import { ProductException } from '../../exceptions/product-exceptions';
import { AwsService } from 'src/global/aws/aws.service';
@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private productOptionRepository: Repository<Option>,

    private readonly productService: ProductService,
    private readonly awsService: AwsService,
    private dataSource: DataSource,
  ) {}

  public async findOptionByOptionId(optionId: number) {
    const option = await this.productOptionRepository
      .createQueryBuilder('Option')
      .leftJoinAndSelect('Option.product', 'Product')
      .where('Option.optionId = :optionId', { optionId: optionId })
      .getOne();
    if (!option) {
      throw new ProductException(ProductException.OPTION_NOT_FOUND);
    }
    return option;
  }

  async addOptionForProduct(
    addOptionForProductDto: AddOptionForProductDto,
    userId: number,
  ) {
    const product = await this.productService.checkProductOwner(
      addOptionForProductDto.productId,
      userId,
    );

    const option: Option = this.productOptionRepository.create({
      product: product,
      optionName: addOptionForProductDto.optionName,
      addPrice: addOptionForProductDto.addPrice,
      stock: addOptionForProductDto.stock,
    });
    await this.productOptionRepository.save(option);
  }

  async update(
    optionId: number,
    updateOptionDto: UpdateOptionDto,
    userId: number,
  ) {
    const option = await this.findOptionByOptionId(optionId);
    const product = option.product;
    await this.productService.checkProductOwner(product.productId, userId);

    await this.productOptionRepository.update(optionId, updateOptionDto);
  }

  async deleteOption(optionId: number, userId: number) {
    const option = await this.findOptionByOptionId(optionId);
    const product = option.product;
    await this.productService.checkProductOwner(product.productId, userId);
    await this.productOptionRepository.delete({ optionId: optionId });
  }

  async insertOrUpdate(
    options: AddOptionForProductDto[],
    productId: number,
    userId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const option of options) {
        if (option.optionId) {
          // optionId가 있으면 update
          const optionEntity = new Option();
          if (option.file) {
            const file = await this.saveBase64ToFile(option.file);
            const url = await this.awsService.imageUpload(file);
            optionEntity.imageUrl = url.imageUrl;
          }
          optionEntity.optionName = option.optionName;
          optionEntity.addPrice = option.addPrice;
          optionEntity.stock = option.stock;
          await queryRunner.manager.update(
            Option,
            option.optionId,
            optionEntity,
          );
        } else {
          // optionId가 없으면 insert
          const product = await this.productService.checkProductOwner(
            productId,
            userId,
          );
          const optionEntity = new Option();
          const file = await this.saveBase64ToFile(option.file);
          const url = await this.awsService.imageUpload(file);
          optionEntity.optionName = option.optionName;
          optionEntity.product = product;
          optionEntity.addPrice = option.addPrice;
          optionEntity.stock = option.stock;
          optionEntity.imageUrl = url.imageUrl;
          await queryRunner.manager.save(optionEntity);
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async saveBase64ToFile(base64Data: string) {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 data');
    }

    const data = Buffer.from(matches[2], 'base64');
    return data;
  }
}
