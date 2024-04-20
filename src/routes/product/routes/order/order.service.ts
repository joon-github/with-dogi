import { Injectable } from '@nestjs/common';
import { OrderWithItemsInCartDto } from './dto/orderCart.dto';
import { DataSource, In, Repository } from 'typeorm';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { CartService } from '../cart/cart.service';
import { OrderException } from './exceptions/order-exceptions';
import { OrderItem } from './entities/orderItem.entity';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Option } from '../options/entities/option.entity';
import { Members } from 'src/routes/auth/entities/Members.entity';
import { Cart } from '../cart/entities/cart.entity';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly cartService: CartService,
  ) {}
  async OrderWithItemsInCart(
    orderWithItemsInCartDto: OrderWithItemsInCartDto,
    userId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.authService.findUserById(userId);

      const orderNumber: string = uuidv4();
      const order = new Order();
      order.orderNumber = orderNumber;
      order.user = user;

      const saveOrder = await queryRunner.manager.save(order);

      const cartItems = await this.cartService.findMyCartItems(
        userId,
        orderWithItemsInCartDto.cartIds,
      );
      let totalCost = 0;

      for (const cartItem of cartItems) {
        if (cartItem.quantity > cartItem.option.stock) {
          throw new OrderException(
            OrderException.OPTION_QUANTITY_SHORTAGE(cartItem.option.optionName),
          );
        }
        totalCost +=
          (cartItem.option.product.price + cartItem.option.addPrice) *
          cartItem.quantity;
        const orderItem = new OrderItem();
        orderItem.order = saveOrder;
        orderItem.option = cartItem.option;
        orderItem.quantity = cartItem.quantity;
        orderItem.price =
          (cartItem.option.product.price + cartItem.option.addPrice) *
          cartItem.quantity;

        await queryRunner.manager.save(orderItem);
        await queryRunner.manager.update(
          Option,
          { optionId: cartItem.option.optionId },
          {
            stock: cartItem.option.stock - cartItem.quantity,
          },
        );
      }

      if (user.point < totalCost) {
        throw new OrderException(OrderException.LACK_POINTS);
      }
      const newPoint = Math.floor(user.point - totalCost);
      await queryRunner.manager.update(
        Members,
        { userId: user.userId },
        {
          point: newPoint,
        },
      );

      await queryRunner.manager.delete(Cart, {
        cartId: In(orderWithItemsInCartDto.cartIds),
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    // 트렌젝션 실행
    // userId로 user를 가져온다.
    // uuIdfmf 생성한다. (orderNumber)
    // 새로운 order을 생성한다.
    // orderCartDto.cartIds를 순회한다
    // cartId로 cart를 각각 가져온다.
    // cart.userId와 userId가 비교한다.
    // cart.optionId로 option을 가져온다.
    // cart.quantity와 와 option.stock을 비교해서 option.stock이 더 클 경우 (작을 경우 '{optionName} 의 수량이 부족합니다')
    // 새로 만든 order와 찾은 option,cart로 OrderItem을 추가한다.
    // option.stock 을 cart.quantity 뺀 값으로 수정한다.
  }
}
