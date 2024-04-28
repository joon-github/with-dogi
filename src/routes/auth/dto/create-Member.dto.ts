import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'tester@naver.com', description: '기본값' })
  email: string;

  @ApiProperty({ example: 'test', description: '기본값' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(/(?=.*\W)/, {
    message: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({ example: 'test', description: '기본값' })
  @IsString()
  passwordConfirm: string;

  @ApiProperty({ example: 'tester', description: '기본값' })
  @IsString()
  name: string;

  @ApiProperty({ example: '010-0000-0000', description: '기본값' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '서울 어딘가', description: '기본값' })
  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  profilePhoto: string;
}
