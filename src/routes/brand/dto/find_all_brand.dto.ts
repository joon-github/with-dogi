import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class FindAllBrandQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  brandName?: string;
}
