import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

class UpdateProdutsBaseDto extends OmitType(CreateProductDto, [
  'user_id',
] as const) {}

export class UpdateProductDto extends PartialType(UpdateProdutsBaseDto) {
  updated_at: Date;
}
