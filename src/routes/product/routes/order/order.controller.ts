import { Controller, Post, Body, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { OrderWithItemsInCartDto } from './dto/orderCart.dto';
import { OrderDirectDto } from './dto/orderDirect.dto';

@Controller('product/order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('cart')
  @ApiOperation({ summary: '장바구니에서 선택 구매' })
  async OrderCartItems(
    @Body() orderWithItemsInCartDto: OrderWithItemsInCartDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.orderService.orderWithItemsInCart(
      orderWithItemsInCartDto,
      user.userId,
    );
    return {
      statusCode: 201,
      message: '구매 성공',
      data: null,
    };
  }

  @Post('direct')
  @ApiOperation({ summary: '즉시 구매' })
  async OrderDirect(
    @Body() orderDirectDto: OrderDirectDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.orderService.orderDirect(orderDirectDto, user.userId);
    return {
      statusCode: 201,
      message: '구매 성공',
      data: null,
    };
  }
}
