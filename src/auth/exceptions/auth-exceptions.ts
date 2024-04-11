import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  public static get LOGIN_FAIL(): string {
    return '로그인 정보가 정확하지 않습니다.';
  }

  public static get ALREADY_REGISTERED_USER(): string {
    return '이미 등록된 이메일 입니다.';
  }

  public static get SAME_PASSWORD(): string {
    return '기존 비밀번호와 새 비밀번호가 동일합니다.';
  }

  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
