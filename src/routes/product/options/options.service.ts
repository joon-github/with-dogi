import { Injectable } from '@nestjs/common';
import { AddOptionForProductDto } from './dto/addOptionForProductDto.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product.service';
@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private productOptionRepository: Repository<Option>,

    private readonly productService: ProductService,
  ) {}
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
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }
}
