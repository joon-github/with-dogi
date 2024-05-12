import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddOptionForProductDto {
  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  @IsOptional()
  readonly optionId?: number;

  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  @IsOptional()
  readonly productId?: number;

  @ApiProperty({ example: 1, description: '기본값' })
  @IsString()
  @IsOptional()
  readonly file?: string;

  @ApiProperty({ example: '옵션값', description: '기본값' })
  @IsString()
  @IsOptional()
  readonly optionName?: string;

  @ApiProperty({ example: 2000, description: '기본값' })
  @IsNumber()
  @IsOptional()
  readonly addPrice?: number;

  @ApiProperty({ example: 200, description: '기본값' })
  @IsNumber()
  @IsOptional()
  readonly stock?: number;
}
