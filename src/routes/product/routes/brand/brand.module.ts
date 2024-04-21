import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/routes/auth/auth.module';
import { Members } from 'src/routes/auth/entities/Members.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Brand, Members]), AuthModule],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
