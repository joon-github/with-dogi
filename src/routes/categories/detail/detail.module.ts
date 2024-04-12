import { Module } from '@nestjs/common';
import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesDetail } from './entities/CategoriesDetail.entity';
import { AuthModule } from 'src/routes/auth/auth.module';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { CategoriesService } from '../categories.service';
import { Categories } from '../entities/Categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories, CategoriesDetail, Members]),
    AuthModule,
  ],
  controllers: [DetailController],
  providers: [DetailService, AuthService, CategoriesService],
})
export class DetailModule {}
