import { IsIn, IsString } from 'class-validator';
import { CategoryType } from '../enums/category_type.enum';

export class FindCategoryQueryDto {
  @IsString()
  @IsIn(['product', 'community'])
  readonly type?: CategoryType;
}
