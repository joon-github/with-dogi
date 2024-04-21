import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ProductDependenciesModule } from '../../productDependencies.module';

@Module({
  imports: [ProductDependenciesModule],
  controllers: [OrderController],
})
export class OrderModule {}
