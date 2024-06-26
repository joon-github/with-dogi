import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'id@naver.com', description: '기본값' })
  email: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(/(?=.*\W)/, {
    message: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.',
  })
  @ApiProperty({ example: 'password', description: '기본값' })
  password: string;
}
