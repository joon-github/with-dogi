import { Controller, Post, Body, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { OrderWithItemsInCartDto } from './dto/orderCart.dto';

@Controller('product/order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '상품 구매' })
  async OrderCartItems(
    @Body() orderWithItemsInCartDto: OrderWithItemsInCartDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.orderService.OrderWithItemsInCart(
      orderWithItemsInCartDto,
      user.userId,
    );
    return {
      statusCode: 201,
      message: '구매 성공',
      data: null,
    };
  }
}
