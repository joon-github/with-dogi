import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from 'src/global/interfaces/exception.interface';

export class ReviewException extends HttpException {
  public static get REVIEW_NOT_FOUND(): EXCEPTION {
    return {
      message: '해당 리뷰를 찾을 수 없습니다.',
      status: HttpStatus.NOT_FOUND,
    };
  }

  public static get REVIEW_ALREADY_WRITTEN(): EXCEPTION {
    return {
      message: '이미 리뷰를 작성하셨습니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }

  constructor(exception: EXCEPTION) {
    super(exception.message, exception.status);
  }
}
