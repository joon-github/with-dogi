import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from 'src/global/interfaces/exception.interface';

export class AuthException extends HttpException {
  public static get LOGIN_FAIL(): EXCEPTION {
    return {
      message: '로그인 정보가 정확하지 않습니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }

  public static get ALREADY_REGISTERED_USER(): EXCEPTION {
    return {
      message: '이미 등록된 이메일 입니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }

  public static get SAME_PASSWORD(): EXCEPTION {
    return {
      message: '기존 비밀번호와 새 비밀번호가 동일합니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }

  public static get IS_NOT_AUTHORIZED(): EXCEPTION {
    return {
      message: '권한이 없습니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }

  public static get LOGIN_REQUIRED(): EXCEPTION {
    return {
      message: '로그인이 필요합니다.',
      status: HttpStatus.FORBIDDEN,
    };
  }

  public static get ACCESS_TOKEN_EXPIRED(): EXCEPTION {
    return {
      message: '엑세스 토큰 기간이 만료되었습니다.',
      status: HttpStatus.UNAUTHORIZED,
    };
  }

  public static get REFRESH_TOKEN_EXPIRED(): EXCEPTION {
    return {
      message: '로그인 세션이 만료되었습니다.',
      status: HttpStatus.FORBIDDEN,
    };
  }

  constructor(exception: EXCEPTION) {
    super(exception.message, exception.status);
  }
}
