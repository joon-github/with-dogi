import { Module } from '@nestjs/common';
import { OptionsController } from './options.controller';
import { ProductDependenciesModule } from '../../productDependencies.module';

@Module({
  imports: [ProductDependenciesModule],
  controllers: [OptionsController],
})
export class OptionsModule {}
