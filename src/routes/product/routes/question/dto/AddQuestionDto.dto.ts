import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddQuestionDto {
  @ApiProperty({ example: 1, description: '기본값' })
  @IsNumber()
  readonly optionId: number;

  @ApiProperty({ example: '문의 제목', description: '기본값' })
  @IsString()
  readonly questionTitle: string;

  @ApiProperty({ example: '문의 내용', description: '기본값' })
  @IsString()
  readonly questionContent: string;
}
