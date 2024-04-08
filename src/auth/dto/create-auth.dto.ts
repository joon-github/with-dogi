import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @ApiProperty({ example: 'tester@naver.com', description: '기본값' })
  email: string;

  @ApiProperty({ example: 'test', description: '기본값' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'tester', description: '기본값' })
  @IsString()
  name: string;

  @ApiProperty({ example: '010-0000-0000', description: '기본값' })
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
