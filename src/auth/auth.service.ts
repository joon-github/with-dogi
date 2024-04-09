import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-Member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from './entities/Members.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtTokenService } from './jwt.service';
import { Request, Response } from 'express';
import { UpdateMemberDto } from './dto/update-Memeber.dto';
import { TokenPayload } from './interface/token-payload.interface';

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
      throw new HttpException('로그인 정보가 정확하지 않습니다.', 400);
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException('로그인 정보가 정확하지 않습니다.', 400);
    }

    const payload: TokenPayload = {
      user_id: findUser.user_id,
      email: findUser.email,
    };

    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

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
    try {
      const decoded: TokenPayload = this.jwtService.verifyToken(
        request,
        'refreshToken',
        process.env.REFRESH_TOKEN_SECRET,
      );
      const payload: TokenPayload = {
        user_id: decoded.user_id,
        email: decoded.email,
      };
      const accessToken = this.jwtService.generateAccessToken(payload);
      response.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 15,
        sameSite: 'strict',
        httpOnly: true,
      });
    } catch (e) {
      throw e;
    }
  }

  async updateMember(updateMemberDto: UpdateMemberDto, request: Request) {
    const payload = request['user'] as TokenPayload;
    console.log(updateMemberDto.checkPassword, updateMemberDto.password);
    if (updateMemberDto.checkPassword !== undefined) {
      const findUser = await this.memberRepository.findOne({
        where: { email: payload.email },
      });

      const isPasswordMatching = await bcrypt.compare(
        updateMemberDto.checkPassword,
        findUser.password,
      );

      if (!isPasswordMatching) {
        throw new HttpException('비밀번호가 일치하지 않습니다.', 400);
      }
    }

    if (updateMemberDto.password !== undefined) {
      const saltOrRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(
        updateMemberDto.password,
        saltOrRounds,
      );
      updateMemberDto.password = hashedPassword;
    }
    await this.memberRepository.update(payload.user_id, updateMemberDto);
  }
}
