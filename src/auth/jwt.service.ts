import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  public generateAccessToken = (email: string) => {
    const payload = { email: email };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m', // 액세스 토큰 유효 시간
    });
    return access_token;
  };

  public generateRefreshToken = () => {
    const refresh_token = this.jwtService.sign(
      {},
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '30m', // 액세스 토큰 유효 시간
      },
    );

    return refresh_token;
  };
}
