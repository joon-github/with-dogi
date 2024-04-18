import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @ApiProperty({ example: '테스트 브랜드', description: '기본값' })
  readonly brandName: string;
}
