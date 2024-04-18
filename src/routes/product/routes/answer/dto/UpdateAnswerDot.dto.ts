import { PartialType } from '@nestjs/swagger';
import { AddAnswerDto } from './AddAnswerDto.dto';

export class UpdateAnswerDto extends PartialType(AddAnswerDto) {}
