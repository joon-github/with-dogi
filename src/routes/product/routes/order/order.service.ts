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
import { OptionsService } from '../options/options.service';
import { OrderDirectDto } from './dto/orderDirect.dto';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly optionService: OptionsService,
  ) {}

  public async checkSalesHistoryWithUserIdAndorderDetailId(
    userId: number,
    orderDetailId: number,
  ) {
    const salesHistory = await this.orderItemRepository
      .createQueryBuilder('OrderItem')
      .leftJoinAndSelect('OrderItem.order', 'Order')
      .where('Order.userId = :userId', { userId })
      .andWhere('OrderItem.orderDetailId = :orderDetailId', { orderDetailId })
      .getOne();
    if (!salesHistory) {
      throw new OrderException(OrderException.SALES_HISTORY);
    }
    return salesHistory;
  }
  public async checkSalesHistoryWithbrandId(brandId: number) {
    const salesHistory = await this.orderItemRepository
      .createQueryBuilder('OrderItem')
      .leftJoinAndSelect('OrderItem.option', 'Option')
      .leftJoinAndSelect('Option.product', 'Product')
      .leftJoinAndSelect('Option.brand', 'Brand')
      .where('Brand.brandId = :brandId', { brandId })
      .getMany();
    if (salesHistory || salesHistory.length > 0) {
      throw new OrderException(OrderException.SALES_HISTORY);
    }
  }
  async orderWithItemsInCart(
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
  }

  async orderDirect(
    orderDirectDto: OrderDirectDto,
    userId: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const option = await this.optionService.findOptionByOptionId(
        orderDirectDto.optionId,
      );
      if (option.stock < orderDirectDto.quantity) {
        throw new OrderException(
          OrderException.OPTION_QUANTITY_SHORTAGE(option.optionName),
        );
      }
      const user = await this.authService.findUserById(userId);
      const buyPrice =
        (option.product.price + option.addPrice) * orderDirectDto.quantity;

      if (user.point < buyPrice) {
        throw new OrderException(OrderException.LACK_POINTS);
      }

      const orderNumber: string = uuidv4();
      const order = new Order();
      order.orderNumber = orderNumber;
      order.user = user;

      const saveOrder = await queryRunner.manager.save(order);
      const orderItem = new OrderItem();
      orderItem.order = saveOrder;
      orderItem.price = buyPrice;
      orderItem.option = option;

      await queryRunner.manager.save(orderItem);
      await queryRunner.manager.update(
        Option,
        { optionId: orderDirectDto.optionId },
        {
          stock: option.stock - orderDirectDto.quantity,
        },
      );
      const newPoint = Math.floor(user.point - buyPrice);
      await queryRunner.manager.update(
        Members,
        { userId: user.userId },
        {
          point: newPoint,
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
