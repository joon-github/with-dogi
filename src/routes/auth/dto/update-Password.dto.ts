import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordrDto {
  @IsString()
  @ApiProperty({ example: 'beforPassword', description: '기본값' })
  beforPassword: string;

  @IsString()
  @ApiProperty({ example: 'afterPassword', description: '기본값' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(/(?=.*\W)/, {
    message: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.',
  })
  afterPassword: string;
}
