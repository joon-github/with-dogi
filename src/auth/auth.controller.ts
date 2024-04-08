import { Controller, Post, Body, Res } from '@nestjs/common';

import { AuthService } from './auth.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMemberDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.authService.signUp(createMemberDto);
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인' })
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, response);
  }
}
