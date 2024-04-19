import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from 'src/global/interfaces/exception.interface';

export class CartException extends HttpException {
  public static get CART_EMPTY(): EXCEPTION {
    return {
      message: '장바구니가 비어있습니다.',
      status: HttpStatus.NOT_FOUND,
    };
  }

  public static get CART_NOT_FOUND(): EXCEPTION {
    return {
      message: '해당 장바구니애 담긴 상품을 찾을 수 없습니다.',
      status: HttpStatus.NOT_FOUND,
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
