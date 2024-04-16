import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { AddOptionForProductDto } from '../options/dto/addOptionForProductDto.dto';
import { Transform } from 'class-transformer';
export class CreateProductDto {
  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly brandId: number;

  @ApiProperty({ example: '테스트 상품', description: '기본값' })
  @Length(1, 10, {
    message: '상품 이름은 1글자 이상 50글자 미만으로 입력해주세요.',
  })
  @IsString({ message: '상품 이름은 문자열로 입력해주세요.' })
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

  @ApiProperty({
    example: [
      {
        optionName: '옵션값',
        addPrice: 2000,
        stock: 200,
      },
    ],
    description: '기본값',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  readonly options?: AddOptionForProductDto[];
}
