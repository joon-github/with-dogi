import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class FindAllProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_detail_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id?: number;
}
