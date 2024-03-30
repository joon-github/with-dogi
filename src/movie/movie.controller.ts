import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/movie.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly moviesService: MovieService) {}

  @Get()
  getAll(@Res() res: Response, @Query('a') a: string, @Query('b') b: string) {
    console.log(a, b);
    const data = this.moviesService.getAll();
    res
      .status(200)
      .send({ data: data, message: '성공적으로 영화 데이터를 받아왔습니다.' });
  }

  @Get(':id')
  getOne(@Param('id') movieId: number) {
    return this.moviesService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData);
  }
}
