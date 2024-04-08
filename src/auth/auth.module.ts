import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from './entities/Members.entity';
import { JwtTokenService } from './jwt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Members])],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, JwtService],
})
export class AuthModule {}
