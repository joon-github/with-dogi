import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllCategoriesQueryDto {
  @IsOptional()
  @IsString()
  readonly category_name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly user_id?: number;
}
