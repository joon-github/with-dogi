import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from 'src/global/interfaces/exception.interface';

export class QuestionException extends HttpException {
  public static get QUESTION_NOT_FOUND(): EXCEPTION {
    return {
      message: '해당 문의를 찾을 수 없습니다.',
      status: HttpStatus.NOT_FOUND,
    };
  }

  public static get QUESTION_CREATE_FAIL(): EXCEPTION {
    return {
      message: '문의 등록에 실패하였습니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }

  public static get NOT_QUESTION_OWNER(): EXCEPTION {
    return {
      message: '문의 등록자가 아닙니다.',
      status: HttpStatus.UNAUTHORIZED,
    };
  }

  public static get NOT_DELETE_PERMISSION(): EXCEPTION {
    return {
      message: '삭제 권한이 없습니다.',
      status: HttpStatus.UNAUTHORIZED,
    };
  }

  constructor(exception: EXCEPTION) {
    super(exception.message, exception.status);
  }
}
