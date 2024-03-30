import { IsString, IsNumber, IsOptional } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types'; // pnpm install @nestjs/mapped-types
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsNumber()
  readonly year: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  readonly genres: string[];
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {} //CreateMovieDto을 상속 받아 전부 옵셔널로 바꿔줍니다.
