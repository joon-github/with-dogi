import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
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

  @ApiProperty({ example: 'tester', description: '기본값' })
  @IsString()
  name: string;

  @ApiProperty({ example: '010-0000-0000', description: '기본값' })
  @Matches(/^\d{3}-\d{3,4}-\d{4}$/, {
    message: '전화번호는 3-3(또는 4)-4 형식이어야 합니다.',
  })
  @IsString()
  phone: string;

  @ApiProperty({ example: '서울 어딘가', description: '기본값' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'admin', description: '기본값' })
  @IsString()
  @IsIn(['user', 'seller', 'admin'])
  role: string;

  @IsString()
  @IsOptional()
  profile_photo: string;
}
