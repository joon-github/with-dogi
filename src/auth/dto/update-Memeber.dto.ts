import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-Member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  checkPassword: string;
}
