import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { AuthModule } from 'src/routes/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Members]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, AuthService],
})
export class CategoryModule {}
