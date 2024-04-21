import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from 'src/global/interfaces/exception.interface';

export class OrderException extends HttpException {
  public static OPTION_QUANTITY_SHORTAGE(item: string): EXCEPTION {
    return {
      message: `${item}의 수량이 부족합니다.`,
      status: HttpStatus.BAD_REQUEST,
    };
  }

  public static get SALES_HISTORY(): EXCEPTION {
    return {
      message: '구매된 이력이 없습니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }
  public static get LACK_POINTS(): EXCEPTION {
    return {
      message: '포인트가 부족합니다.',
      status: HttpStatus.BAD_REQUEST,
    };
  }

  constructor(exception: EXCEPTION) {
    super(exception.message, exception.status);
  }
}
