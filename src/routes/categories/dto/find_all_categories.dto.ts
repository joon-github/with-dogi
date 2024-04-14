import { IsIn, IsString } from 'class-validator';
import { CategoriesType } from '../enums/categories_type.enum';

export class FindCategoriesQueryDto {
  @IsString()
  @IsIn(['product', 'community'])
  readonly type?: CategoriesType;
}
