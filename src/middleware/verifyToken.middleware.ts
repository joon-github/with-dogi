import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('adf', req);
    const token = req.cookies['accessToken'];
    if (!token) {
      res.status(403).send({
        message: '로그인 실패',
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req['user'] = decoded;
    } catch (e) {
      console.log(e);
      res.status(401).send({
        message: '인증실패',
      });
    }
    next();
  }
}
