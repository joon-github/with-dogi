import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from './entities/Members.entity';
import { JwtTokenService } from './services/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { AwsService } from 'src/global/aws/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([Members])],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, JwtService, AwsService],
  exports: [JwtTokenService, AuthService, JwtService, AwsService],
})
export class AuthModule {}
