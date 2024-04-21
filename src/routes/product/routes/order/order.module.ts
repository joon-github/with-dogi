import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/entities/cart.entity';
import { ProductDependenciesModule } from '../../productDependencies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart]),
    ProductDependenciesModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, CartService],
})
export class OrderModule {}
