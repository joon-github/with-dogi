import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-Member.dto';

class UpdateMemberBaseDto extends OmitType(CreateMemberDto, [
  'email',
] as const) {}

export class UpdateMemberDto extends PartialType(UpdateMemberBaseDto) {}
