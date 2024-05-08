import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Patch,
  Param,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { AuthService } from './services/auth.service';

import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMemberDto } from './dto/create-Member.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { UpdateMemberDto } from './dto/update-Memeber.dto';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { UpdatePasswordrDto } from './dto/update-Password.dto';
import { UpdateRoleDto } from './dto/update-Role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { Members } from './entities/Members.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/loginCheck')
  @ApiOperation({ summary: '로그인 상태 확인' })
  async loginCheck(
    @Req() request: Request,
  ): Promise<ResponesContainerDto<boolean>> {
    return await this.authService.loginCheck(request);
  }

  @Get('/myInfo')
  @ApiOperation({ summary: '내 정보 가져오기' })
  async myInfo(
    @Req() request: Request,
  ): Promise<ResponesContainerDto<Members>> {
    const user = request['user'] as TokenPayload;
    const findUser = await this.authService.findUserById(user.userId);

    delete findUser.userId;
    delete findUser.password;
    return {
      statusCode: 200,
      message: '내 정보 가져오기 성공',
      data: findUser,
    };
  }

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
      message: null,
      data: null,
    };
  }

  @Get('/logout')
  @ApiOperation({ summary: '로그아웃' })
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponesContainerDto<null>> {
    await this.authService.logout(response);
    return {
      statusCode: 200,
      message: '로그아웃 성공',
      data: null,
    };
  }

  @Post('/accessToken')
  @ApiOperation({ summary: '엑세스 토큰 재발급' })
  async generateAccessToken(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    await this.authService.generateAccessToken(request, response);
    return {
      statusCode: 200,
      message: '엑세스 토큰 재발급 성공',
      data: null,
    };
  }

  @Patch('/member')
  @ApiOperation({ summary: '회원 정보 수정' })
  async updateMember(
    @Body() updateProfileDto: UpdateMemberDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    await this.authService.updateMember(updateProfileDto, request);
    return {
      statusCode: 200,
      message: '회원 정보 수정 성공',
      data: null,
    };
  }

  @Patch('/password')
  @ApiOperation({ summary: '비밀번호 수정' })
  async updatePassword(
    @Body() updatePasswordrDto: UpdatePasswordrDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    await this.authService.updatePassword(updatePasswordrDto, request);
    return {
      statusCode: 200,
      message: '비밀번호 수정 성공',
      data: null,
    };
  }

  @Patch('/role/:userId')
  @ApiOperation({ summary: '권한 수정' })
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() request: Request,
    @Param('userId') userId: number,
  ): Promise<ResponesContainerDto<null>> {
    await this.authService.updateRole(updateRoleDto, request, userId);
    return {
      statusCode: 200,
      message: '권한 수정 성공',
      data: null,
    };
  }

  @Patch('/profile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '프로필 사진 변경' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '프로필 사진',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.authService.updateProfile(file, user);
    return {
      statusCode: 200,
      message: '프로필 사진 변경 성공',
      data: null,
    };
  }
}
