import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ example: 'admin', description: '기본값' })
  @IsString()
  @IsIn(['user', 'seller', 'admin'])
  role: string;
}
