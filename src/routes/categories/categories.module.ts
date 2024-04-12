import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from './entities/Categories.entity';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { AuthModule } from 'src/routes/auth/auth.module';
import { DetailModule } from './detail/detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories, Members]),
    AuthModule,
    DetailModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, AuthService],
})
export class CategoriesModule {}
