import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { Members } from 'src/auth/entities/Members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Members]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService, AuthService],
})
export class ProductModule {}
