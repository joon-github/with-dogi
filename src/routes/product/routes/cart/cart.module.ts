import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { ProductDependenciesModule } from '../../productDependencies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductDependenciesModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
