import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/productImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])],
})
export class ProductImageModule {}
