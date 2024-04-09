import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from './interface/token-payload.interface';
@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  public generateAccessToken = (payload: TokenPayload) => {
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m', // 액세스 토큰 유효 시간
    });
    return access_token;
  };

  public generateRefreshToken = (payload: TokenPayload) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '60m', // 액세스 토큰 유효 시간
    });

    return refresh_token;
  };

  public verifyToken = (req: Request, tokenName: string, secret: string) => {
    const token = req.cookies[tokenName];
    if (!token) {
      throw new HttpException('로그인이 필요합니다.', 403);
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: secret,
      });
      return decoded;
    } catch (e) {
      throw new HttpException('인증실패.', 401);
    }
  };
}
