import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { AuthService } from 'src/auth/services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  controllers: [ProductController],
  providers: [ProductService, AuthService],
})
export class ProductModule {}
