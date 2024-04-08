import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateMemberDto) {}
