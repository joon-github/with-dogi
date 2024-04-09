import { Controller, Post, Body, Res, Req, Patch } from '@nestjs/common';

import { AuthService } from './auth.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMemberDto } from './dto/create-Member.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { UpdateMemberDto } from './dto/update-Memeber.dto';

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

  @Post('/logout')
  @ApiOperation({ summary: '로그아웃' })
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Post('/accessToken')
  @ApiOperation({ summary: '엑세스 토큰 재발급' })
  generateAccessToken(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.generateAccessToken(request, response);
  }

  @Patch('/member')
  @ApiOperation({ summary: '회원 정보 수정' })
  updateMember(
    @Body() updateProfileDto: UpdateMemberDto,
    @Req() request: Request,
  ) {
    return this.authService.updateMember(updateProfileDto, request);
  }
}
