import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { AuthException } from '../exceptions/auth-exceptions';
@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  public generateAccessToken = (response: Response, payload: TokenPayload) => {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1m', // 액세스 토큰 유효 시간
    });
    response.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 30,
      sameSite: 'strict',
      httpOnly: true,
    });
    return accessToken;
  };

  public generateRefreshToken = (response: Response, payload: TokenPayload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '60m', // 액세스 토큰 유효 시간
    });

    response.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/accessToken',
    });
    return refreshToken;
  };

  public verifyToken = (req: Request, tokenName: string, secret: string) => {
    const token = req.cookies[tokenName];
    if (!token) {
      throw new AuthException(AuthException.LOGIN_REQUIRED);
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: secret,
      });
      return decoded;
    } catch (e) {
      throw new AuthException(
        tokenName === 'accessToken'
          ? AuthException.ACCESS_TOKEN_EXPIRED
          : AuthException.REFRESH_TOKEN_EXPIRED,
      );
    }
  };
}
