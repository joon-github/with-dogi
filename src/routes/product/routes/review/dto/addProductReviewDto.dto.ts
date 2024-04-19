import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class AddReviewDto {
  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly userId: number;

  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly optionId: number;

  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  @Min(1, { message: '평점은 최소 1 이상이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5 이하이어야 합니다.' })
  readonly rating: number;

  @ApiProperty({ example: '리뷰 내용', description: '기본값' })
  @IsString()
  readonly comment: string;
}
