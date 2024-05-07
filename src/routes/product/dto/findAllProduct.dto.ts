import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString, IsBoolean } from 'class-validator';

export class FindAllProductQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly my?: boolean;

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
