import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class OrderDirectDto {
  @IsNumber()
  @ApiProperty({ example: 87, description: '옵션 id' })
  optionId: number;

  @IsNumber()
  @ApiProperty({ example: 10, description: '수량' })
  quantity: number;
}
