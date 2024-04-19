import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderCartItemsDto } from './dto/OrderCartItems.dto';

@Controller('product/order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '상품 구매' })
  async OrderCartItems(
    @Body() OrderCartItemsDto: OrderCartItemsDto,
  ): Promise<ResponesContainerDto<null>> {
    await this.orderService.OrderCartItems(OrderCartItemsDto);
    return {
      statusCode: 201,
      message: '구매 성공',
      data: null,
    };
  }
}
