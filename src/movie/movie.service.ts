import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/movie.dto';

@Injectable()
export class MovieService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: number): Movie {
    const movie = this.movies.find((movie) => movie.id === id);
    if (!movie) {
      throw new NotFoundException('Movie with ID : NOT_FOUND');
    }
    return movie;
  }

  create(movieData: CreateMovieDto) {
    this.movies.push({ id: this.movies.length + 1, ...movieData });
  }
}
