import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';
export class CreateProductDto {
  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly brandId: number;

  @ApiProperty({ example: '테스트 상품', description: '기본값' })
  @Length(1, 10, { message: '카테고리 이름은 50글자 미만으로 입력해주세요.' })
  @IsString()
  readonly productName: string;

  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly categoryId: number;

  @ApiProperty({ example: 2000, description: '기본값' })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ example: '테스트 상품 설명', description: '기본값' })
  @IsString()
  readonly description: string;

  @ApiProperty({ example: 20, description: '기본값' })
  @IsNumber()
  readonly stock?: number;
}
