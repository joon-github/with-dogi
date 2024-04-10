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
    const findUser = await this.memberRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!findUser) {
      throw new AuthException(AuthException.LOGIN_FAIL, HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(AuthException.LOGIN_FAIL, HttpStatus.BAD_REQUEST);
    }

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
    if (updateMemberDto.checkPassword !== undefined) {
      const findUser = await this.memberRepository.findOne({
        where: { email: payload.email },
      });

      const isPasswordMatching = await bcrypt.compare(
        updateMemberDto.checkPassword,
        findUser.password,
      );

      if (!isPasswordMatching) {
        throw new AuthException(
          AuthException.LOGIN_FAIL,
          HttpStatus.BAD_REQUEST,
        );
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
