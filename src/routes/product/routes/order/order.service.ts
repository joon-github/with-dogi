import { Injectable } from '@nestjs/common';
import { OrderCartItemsDto } from './dto/OrderCartItems.dto';

@Injectable()
export class OrderService {
  async OrderCartItems(orderCartItemsDto: OrderCartItemsDto) {
    console.log(orderCartItemsDto);
    return 'This action adds a new order';
  }
}
