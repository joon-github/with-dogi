import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from 'src/auth/jwt.service';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtTokenService: JwtTokenService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const decoded = this.jwtTokenService.verifyToken(
      req,
      'accessToken',
      process.env.ACCESS_TOKEN_SECRET,
    );
    req['user'] = decoded;
    next();
  }
}
