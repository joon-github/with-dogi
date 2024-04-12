import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from 'src/global/interfaces/exception.interface';

export class ProductsException extends HttpException {
  public static get PRODUCT_NOT_FOUND(): EXCEPTION {
    return {
      message: '해당 상품을 찾을 수 없습니다.',
      status: HttpStatus.NOT_FOUND,
    };
  }

  constructor(exception: EXCEPTION) {
    super(exception.message, exception.status);
  }
}
