import { PartialType } from '@nestjs/swagger';
import { AddOptionForProductDto } from './addOptionForProductDto.dto';

export class UpdateOptionDto extends PartialType(AddOptionForProductDto) {}
