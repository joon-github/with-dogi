import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  product_code?: string;

  @IsInt()
  limit?: number; // 한 페이지의 최대 항목 수

  @IsInt()
  offset?: number;
}
