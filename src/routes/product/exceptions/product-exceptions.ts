import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from 'src/global/interfaces/exception.interface';

export class ProductException extends HttpException {
  public static get PRODUCT_NOT_FOUND(): EXCEPTION {
    return {
      message: '해당 상품을 찾을 수 없습니다.',
      status: HttpStatus.NOT_FOUND,
    };
  }

  public static get PRODUCT_CREATE_FAIL(): EXCEPTION {
    return {
      message: '상품 등록에 실패하였습니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }
  public static get OPTION_NOT_FOUND(): EXCEPTION {
    return {
      message: '해당 옵션을 찾을 수 없습니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }

  constructor(exception: EXCEPTION) {
    super(exception.message, exception.status);
  }
}
