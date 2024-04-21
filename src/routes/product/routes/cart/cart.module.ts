import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ProductDependenciesModule } from '../../productDependencies.module';

@Module({
  imports: [ProductDependenciesModule],
  controllers: [CartController],
})
export class CartModule {}
