import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-Member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from '../entities/Members.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { JwtTokenService } from './jwt.service';
import { Request, Response } from 'express';
import { UpdateMemberDto } from '../dto/update-Memeber.dto';
import { TokenPayload } from '../interface/token-payload.interface';
import { AuthException } from '../exceptions/auth-exceptions';
import { UpdatePasswordrDto } from '../dto/update-Password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Members)
    private memberRepository: Repository<Members>,

    private jwtService: JwtTokenService,
  ) {}

  private async checkUserInfo<T extends { email: string; password: string }>(
    info: T,
  ) {
    const findUser = await this.memberRepository.findOne({
      where: { email: info.email },
    });
    if (!findUser) {
      throw new AuthException(AuthException.LOGIN_FAIL, HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatching = await bcrypt.compare(
      info.password,
      findUser.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(AuthException.LOGIN_FAIL, HttpStatus.BAD_REQUEST);
    }

    return findUser;
  }

  async signUp(createMemberDto: CreateMemberDto): Promise<void> {
    const findUser = await this.memberRepository.findOne({
      where: { email: createMemberDto.email },
    });
    if (findUser) {
      throw new AuthException(
        AuthException.ALREADY_REGISTERED_USER,
        HttpStatus.BAD_REQUEST,
      );
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
    const findUser = await this.checkUserInfo(loginDto);

    const payload: TokenPayload = {
      user_id: findUser.user_id,
      email: findUser.email,
    };

    this.jwtService.generateAccessToken(response, payload);
    this.jwtService.generateRefreshToken(response, payload);
  }

  async generateAccessToken(
    request: Request,
    response: Response,
  ): Promise<void> {
    const decoded: TokenPayload = this.jwtService.verifyToken(
      request,
      'refreshToken',
      process.env.REFRESH_TOKEN_SECRET,
    );
    const payload: TokenPayload = {
      user_id: decoded.user_id,
      email: decoded.email,
    };
    this.jwtService.generateAccessToken(response, payload);
  }

  async updateMember(updateMemberDto: UpdateMemberDto, request: Request) {
    const payload = request['user'] as TokenPayload;

    await this.memberRepository.update(payload.user_id, updateMemberDto);
  }

  async updatePassword(
    updatePasswordrDto: UpdatePasswordrDto,
    request: Request,
  ) {
    const payload = request['user'] as TokenPayload;
    const info = {
      email: payload.email,
      password: updatePasswordrDto.beforPassword,
    };
    await this.checkUserInfo(info);
    const saltOrRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
    const newPassword = await bcrypt.hash(
      updatePasswordrDto.afterPassword,
      saltOrRounds,
    );

    const isPasswordMatching = await bcrypt.compare(info.password, newPassword);

    if (isPasswordMatching) {
      throw new AuthException(
        AuthException.SAME_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.memberRepository.update(payload.user_id, {
      password: newPassword,
    });
  }
}
