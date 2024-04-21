import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from './entities/Members.entity';
import { JwtTokenService } from './services/jwt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Members])],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, JwtService],
  exports: [JwtTokenService, AuthService, JwtService],
})
export class AuthModule {}
