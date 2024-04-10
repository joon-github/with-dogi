import { Controller, Post, Body, Res, Req, Patch } from '@nestjs/common';

import { AuthService } from './services/auth.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMemberDto } from './dto/create-Member.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { UpdateMemberDto } from './dto/update-Memeber.dto';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { UpdatePasswordrDto } from './dto/update-Password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  async create(
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<ResponesContainerDto<null>> {
    await this.authService.signUp(createMemberDto);
    return {
      statusCode: 201,
      message: '회원가입 성공',
      data: null,
    };
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponesContainerDto<null>> {
    await this.authService.login(loginDto, response);
    return {
      statusCode: 200,
      message: '로그인 성공',
      data: null,
    };
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
  async updateMember(
    @Body() updateProfileDto: UpdateMemberDto,
    @Req() request: Request,
  ) {
    return this.authService.updateMember(updateProfileDto, request);
  }

  @Patch('/password')
  @ApiOperation({ summary: '비밀번호 수정' })
  async updatePassword(
    @Body() updatePasswordrDto: UpdatePasswordrDto,
    @Req() request: Request,
  ) {
    return this.authService.updatePassword(updatePasswordrDto, request);
  }
}
