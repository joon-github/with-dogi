import { Injectable } from '@nestjs/common';
import { OrderWithItemsInCartDto } from './dto/orderCart.dto';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { CartService } from '../cart/cart.service';
import { OptionsService } from '../options/options.service';
import { OrderException } from './exceptions/order-exceptions';
import { OrderDetail } from './entities/orderDetaile';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Option } from '../options/entities/option.entity';
import { Members } from 'src/routes/auth/entities/Members.entity';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly optionService: OptionsService,
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
      const order: Order = await queryRunner.manager.save({
        orderNumber,
        user,
      });

      const cartItems = await this.cartService.findMyCartItems(
        userId,
        orderWithItemsInCartDto.cartIds,
      );
      let totalCost = 0;

      for (const cartItem of cartItems) {
        if (cartItem.quantity < cartItem.option.stock) {
          throw new OrderException(
            OrderException.OPTION_QUANTITY_SHORTAGE(cartItem.option.optionName),
          );
        }
        totalCost +=
          (cartItem.option.product.price + cartItem.option.addPrice) *
          cartItem.quantity;
        const orderDetail: OrderDetail = {
          order,
          option: cartItem.option,
          quantity: cartItem.quantity,
          price:
            (cartItem.option.product.price + cartItem.option.addPrice) *
            cartItem.quantity,
        };
        await queryRunner.manager.save(orderDetail);
        await queryRunner.manager.update(Option, cartItem.option, {
          stock: cartItem.option.stock - cartItem.quantity,
        });
      }

      if (user.point < totalCost) {
        throw new OrderException(OrderException.LACK_POINTS);
      }

      await queryRunner.manager.update(Members, user, {
        point: user.point - totalCost,
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
    // 새로 만든 order와 찾은 option,cart로 orderDetail을 추가한다.
    // option.stock 을 cart.quantity 뺀 값으로 수정한다.
  }
}
