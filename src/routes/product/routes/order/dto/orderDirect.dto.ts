import { IsNumber } from 'class-validator';

export class OrderDirectDto {
  @IsNumber()
  optionId: number;

  @IsNumber()
  quantity: number;
}
