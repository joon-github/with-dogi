import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class FindAllProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly userId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly categoryId?: number;

  @IsOptional()
  @IsString()
  readonly productCode?: string;

  @IsInt()
  @Type(() => Number)
  readonly limit?: number; // 한 페이지의 최대 항목 수

  @IsInt()
  @Type(() => Number)
  readonly offset?: number;
}
