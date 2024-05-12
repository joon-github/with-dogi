import { Transform } from 'class-transformer';
import { AddOptionForProductDto } from './addOptionForProductDto.dto';
import { IsOptional } from 'class-validator';

export class InsertOrUpdateDto {
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? JSON.parse(value) : value;
  })
  options: AddOptionForProductDto[];
}
