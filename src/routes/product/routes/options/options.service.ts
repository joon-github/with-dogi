import { Injectable } from '@nestjs/common';
import { AddOptionForProductDto } from './dto/addOptionForProductDto.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../../product.service';
import { ProductException } from '../../exceptions/product-exceptions';
@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private productOptionRepository: Repository<Option>,

    private readonly productService: ProductService,
  ) {}

  public async findOptionByOptionId(optionId: number) {
    const option = await this.productOptionRepository
      .createQueryBuilder('Option')
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
}
