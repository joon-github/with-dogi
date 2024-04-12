import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class FindAllBrandQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsString()
  brand_name?: string;
}
