import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/movie.dto';
import { ApiTags } from '@nestjs/swagger';
import { error } from 'console';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly moviesService: MovieService) {}

  @Get()
  getAll() {
    return this.moviesService.getAll();
    throw new HttpException({
      status: 401,
      error: 'This is a custom message',
    }, 401);
    // res
    //   .status(200)
    //   .send({ data: data, message: '성공적으로 영화 데이터를 받아왔습니다.' });
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
