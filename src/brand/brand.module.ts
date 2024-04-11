import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { Members } from 'src/auth/entities/Members.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Brand, Members]), AuthModule],
  controllers: [BrandController],
  providers: [BrandService, AuthService],
})
export class BrandModule {}
