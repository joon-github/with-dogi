import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class OrderWithItemsInCartDto {
  @IsArray()
  @ArrayNotEmpty({ message: '빈배열 입니다.' })
  @IsNumber({}, { each: true, message: '배열에는 숫자만 담겨야합니다.' })
  @ApiProperty({ example: [87, 88], description: '장바구니 목록' })
  cartIds: number[];
}
