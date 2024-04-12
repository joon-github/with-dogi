import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class FindAllProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly user_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly category_detail_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly category_id?: number;

  @IsOptional()
  @IsString()
  readonly product_code?: string;

  @IsInt()
  readonly limit?: number; // 한 페이지의 최대 항목 수

  @IsInt()
  readonly offset?: number;
}
