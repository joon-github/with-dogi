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

  findAll() {
    return `This action returns all options`;
  }

  findOne(id: number) {
    return `This action returns a #${id} option`;
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    console.log(updateOptionDto);
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }
}
