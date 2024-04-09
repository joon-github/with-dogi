import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-Member.dto';
import { IsString } from 'class-validator';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @IsString()
  checkPassword: string;
}
