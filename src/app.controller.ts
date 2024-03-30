import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return '안녕하세요. with_dogi API 입니다.'
  }
}
