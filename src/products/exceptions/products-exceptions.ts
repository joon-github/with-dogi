import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductsException extends HttpException {
  public static get PRODUCT_NOT_FOUND(): string {
    return '해당 상품을 찾을 수 없습니다.';
  }

  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
