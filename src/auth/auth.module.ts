import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from './entities/Members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Members])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
