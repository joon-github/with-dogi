import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
export class CreateProductDto {
  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly user_id: number;

  @ApiProperty({ example: 123123, description: '기본값' })
  @IsNumber()
  readonly product_code: number;

  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly brand_id: number;

  @ApiProperty({ example: '테스트 상품', description: '기본값' })
  @IsString()
  readonly product_name: string;

  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly category_detail_id: number;

  @ApiProperty({ example: 2000, description: '기본값' })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ example: '테스트 상품 설명', description: '기본값' })
  @IsString()
  readonly description: string;

  @ApiProperty({ example: 20, description: '기본값' })
  @IsNumber()
  readonly stock: number;

  @IsBoolean()
  readonly is_deleted: boolean;

  @IsNumber()
  readonly sales_count: number;

  @IsDate()
  readonly updated_at: Date;
}
