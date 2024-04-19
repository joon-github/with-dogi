import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateOptionDto {
  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  @Min(1, { message: '구매 수량은 최소 1 이상이어야 합니다.' })
  readonly quantity: number;
}
