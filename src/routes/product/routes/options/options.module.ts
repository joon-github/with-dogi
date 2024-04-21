import { Module } from '@nestjs/common';
import { OptionsController } from './options.controller';
import { ProductModule } from '../../product.module';

@Module({
  imports: [ProductModule],
  controllers: [OptionsController],
})
export class OptionsModule {}
