import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-Member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from './entities/Members.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtTokenService } from './jwt.service';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Members)
    private memberRepository: Repository<Members>,

    private jwtService: JwtTokenService,
  ) {}

  async signUp(createMemberDto: CreateMemberDto): Promise<void> {
    const findUser = await this.memberRepository.findOne({
      where: { email: createMemberDto.email },
    });
    if (findUser) {
      throw new HttpException('이미 등록된 이메일 입니다.', 400);
    }
    const saltOrRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(
      createMemberDto.password,
      saltOrRounds,
    );

    const user = this.memberRepository.create({
      ...createMemberDto,
      password: hashedPassword,
    });

    await this.memberRepository.save(user);
  }

  async login(loginDto: LoginDto, response: Response): Promise<void> {
    const findUser = await this.memberRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!findUser) {
      throw new HttpException('로그인 정보가 정확하지 않습니다.', 401);
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException('로그인 정보가 정확하지 않습니다.', 401);
    }

    const accessToken = this.jwtService.generateAccessToken(loginDto.email);
    const refreshToken = this.jwtService.generateRefreshToken(loginDto.email);

    response.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15,
      sameSite: 'strict',
      httpOnly: true,
    });

    response.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/accessToken',
    });
  }

  async logout(response: Response): Promise<void> {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
  }

  async generateAccessToken(
    request: Request,
    response: Response,
  ): Promise<void> {
    const decoded = this.jwtService.verifyToken(
      request,
      'refreshToken',
      process.env.REFRESH_TOKEN_SECRET,
    );

    const accessToken = this.jwtService.generateAccessToken(decoded.email);

    response.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15,
      sameSite: 'strict',
      httpOnly: true,
    });
  }
}
