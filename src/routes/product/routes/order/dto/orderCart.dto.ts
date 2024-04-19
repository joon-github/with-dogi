import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class OrderWithItemsInCartDto {
  @IsArray()
  @ArrayNotEmpty({ message: '빈배열 입니다.' })
  @IsNumber({}, { each: true, message: '배열에는 숫자만 담겨야합니다.' })
  cartIds: number[];
  @IsNumber()
  userId: number;
  @IsNumber()
  orderNumber: number;
}
