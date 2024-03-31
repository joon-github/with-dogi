import {
  Body,
  Controller,
  Get,
  // HttpException,
  // HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/movie.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly moviesService: MovieService) {}
  @Get()
  getAll() {
    return this.moviesService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') movieId: number) {
    return this.moviesService.getOne(movieId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData);
  }
}
