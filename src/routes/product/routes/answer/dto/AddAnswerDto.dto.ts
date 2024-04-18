import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddAnswerDto {
  @ApiProperty({ example: '답변 내용', description: '기본값' })
  @IsString()
  readonly answerContent: string;
}
