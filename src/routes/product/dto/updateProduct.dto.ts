import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductDto } from './createProduct.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['images'] as const),
) {
  updatedAt: Date;
}
