import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
export class CreateProductDto {
  @ApiProperty()
  @IsNumber()
  readonly user_id: number;

  @ApiProperty()
  @IsNumber()
  readonly product_code: number;

  @ApiProperty()
  @IsNumber()
  readonly brand_id: number;

  @ApiProperty()
  @IsString()
  readonly product_name: string;

  @ApiProperty()
  @IsNumber()
  readonly category_detail_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNumber()
  readonly price: number;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNumber()
  @IsNumber()
  readonly stock: number;

  @ApiProperty()
  @IsBoolean()
  readonly is_deleted: boolean;

  @ApiProperty()
  @IsNumber()
  readonly sales_count: number;

  @IsDate()
  readonly updated_at: Date;
}
