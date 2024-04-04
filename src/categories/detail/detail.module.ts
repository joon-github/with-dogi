import { Module } from '@nestjs/common';
import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';

@Module({
  controllers: [DetailController],
  providers: [DetailService],
})
export class DetailModule {}
