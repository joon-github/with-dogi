import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { AuthService } from 'src/routes/Common/auth/services/auth.service';
import { AuthModule } from 'src/routes/Common/auth/auth.module';
import { Members } from 'src/routes/Common/auth/entities/Members.entity';
import { Brand } from 'src/routes/Product/brand/entities/brand.entity';
import { BrandService } from 'src/routes/Product/brand/brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Members, Brand]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService, AuthService, BrandService],
})
export class ProductModule {}
