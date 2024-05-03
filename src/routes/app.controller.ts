import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHello(@Res() res: Response): void {
    res.send(
      `<html><body><h1>안녕하세요. with_dogi API 입니다.</h1><a href="${process.env.NODE_ENV === "production" ? process.env.BASE_URL : 'http://localhost:8000'}/api-base-docs#/">docs로 이동</a></a></body></html>`,
    );
  }
}
