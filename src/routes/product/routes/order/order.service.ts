import { Injectable } from '@nestjs/common';
import { OrderWithItemsInCartDto } from './dto/orderCart.dto';

@Injectable()
export class OrderService {
  async OrderWithItemsInCart(
    orderWithItemsInCartDto: OrderWithItemsInCartDto,
    userId: number,
  ) {
    // 트렌젝션 실행
    // userId로 user를 가져온다.
    // uuIdfmf 생성한다. (orderNumber)
    // 새로운 order을 생성한다.
    // orderCartDto.cartIds를 순회한다
    // cartId로 cart를 각각 가져온다.
    // cart.userId와 userId가 비교한다.
    // cart.optionId로 option을 가져온다.
    // cart.quantity와 와 option.stock을 비교해서 option.stock이 더 클 경우
    // 새로만든 order와 찾은 option과 cart데이터로 orderDetail을 추가한다.
    // option.stock 을 cart.quantity 뺀 값으로 수정한다.
  }
}
