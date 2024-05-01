import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-Member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from '../entities/Members.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { JwtTokenService } from './jwt.service';
import { Request, Response } from 'express';
import { UpdateMemberDto } from '../dto/update-Memeber.dto';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { AuthException } from '../exceptions/auth-exceptions';
import { UpdatePasswordrDto } from '../dto/update-Password.dto';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { AwsService } from 'src/global/aws/aws.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Members)
    private memberRepository: Repository<Members>,

    private jwtService: JwtTokenService,
    private readonly awsService: AwsService,
  ) {}

  public async findUserByEmail(email: string): Promise<Members> {
    const findUser = await this.memberRepository.findOne({
      where: { email },
    });
    if (!findUser) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }
    return findUser;
  }

  public async findUserById(userId: number): Promise<Members> {
    const findUser = await this.memberRepository.findOne({
      where: { userId },
    });
    if (!findUser) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }
    return findUser;
  }

  public async adminCheck(userId: number): Promise<Members> {
    const findUser = await this.findUserById(userId);
    if (findUser.role !== 'admin') {
      throw new AuthException(AuthException.IS_NOT_AUTHORIZED);
    }
    return findUser;
  }

  private async checkUserInfo<T extends { email: string; password: string }>(
    info: T,
  ) {
    const findUser = await this.findUserByEmail(info.email);
    const isPasswordMatching = await bcrypt.compare(
      info.password,
      findUser.password,
    );

    if (!isPasswordMatching) {
      throw new AuthException(AuthException.LOGIN_FAIL);
    }

    return findUser;
  }

  async signUp(createMemberDto: CreateMemberDto): Promise<void> {
    if (createMemberDto.password !== createMemberDto.passwordConfirm) {
      throw new AuthException(AuthException.PASSWORD_NOT_MATCH);
    }
    const findUser = await this.memberRepository.findOne({
      where: { email: createMemberDto.email },
    });
    if (findUser) {
      throw new AuthException(AuthException.ALREADY_REGISTERED_USER);
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
      userId: findUser.userId,
      email: findUser.email,
    };

    this.jwtService.generateAccessToken(response, payload);
    this.jwtService.generateRefreshToken(response, payload);
  }

  async generateAccessToken(
    request: Request,
    response: Response,
  ): Promise<void> {
    const decoded: TokenPayload = await this.jwtService.verifyToken(
      request,
      'refreshToken',
      process.env.REFRESH_TOKEN_SECRET,
    );
    const payload: TokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
    };
    this.jwtService.generateAccessToken(response, payload);
  }

  async updateMember(updateMemberDto: UpdateMemberDto, request: Request) {
    const payload = request['user'] as TokenPayload;

    await this.memberRepository.update(payload.userId, updateMemberDto);
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
      throw new AuthException(AuthException.SAME_PASSWORD);
    }

    await this.memberRepository.update(payload.userId, {
      password: newPassword,
    });
  }

  async updateRole(
    updateRoleDto: { role: string },
    request: Request,
    userId: number,
  ) {
    const payload = request['user'] as TokenPayload;
    const findUser = await this.memberRepository.findOne({
      where: { userId: payload.userId },
    });
    if (findUser.role !== 'admin') {
      throw new AuthException(AuthException.IS_NOT_AUTHORIZED);
    }
    await this.memberRepository.update(userId, updateRoleDto);
  }

  async loginCheck(request: Request): Promise<ResponesContainerDto<boolean>> {
    const token = request.cookies['accessToken'];
    if (!token) {
      return {
        statusCode: 200,
        message: '로그인 전',
        data: false,
      };
    } else {
      return {
        statusCode: 200,
        message: '로그인 상태 확인 성공',
        data: true,
      };
    }
  }

  async updateProfile(file: Express.Multer.File, user: TokenPayload) {
    const findUser = await this.findUserById(user.userId);
    const url = await this.awsService.imageUpload(file);
    if (findUser.profilePhoto) {
      await this.awsService.deleteImage(findUser.profilePhoto);
    }
    await this.memberRepository.update(user.userId, {
      profilePhoto: url.imageUrl,
    });
  }
}
