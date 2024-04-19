import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { ResponesContainerDto } from 'src/global/dto/respones-container.dto';
import { TokenPayload } from 'src/routes/auth/interfaces/token-payload.interface';
import { AddReviewDto } from './dto/addCartDto.dto';
import { UpdateOptionDto } from './dto/updateOptionDto';

@Controller('product/cart')
@ApiTags('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: '장바구니 담기' })
  async addReview(
    @Body() addOptionForProductDto: AddReviewDto,
    @Req() request: Request,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.cartService.addCart(addOptionForProductDto, user.userId);
    return {
      statusCode: 201,
      message: '장바구니 담기 성공',
      data: null,
    };
  }

  @Delete(':cartId')
  @ApiOperation({ summary: '장바구니 삭제' })
  async deleteCart(
    @Req() request: Request,
    @Param('cartId') cartId: number,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.cartService.deleteCart(cartId, user.userId);
    return {
      statusCode: 200,
      message: '장바구니 삭제 성공',
      data: null,
    };
  }

  @Patch(':cartId')
  @ApiOperation({ summary: '장바구니 수정' })
  async updateCart(
    @Req() request: Request,
    @Param('cartId') cartId: number,
    @Body() updateOptionDto: UpdateOptionDto,
  ): Promise<ResponesContainerDto<null>> {
    const user = request['user'] as TokenPayload;
    await this.cartService.updateCart(cartId, updateOptionDto, user.userId);
    return {
      statusCode: 200,
      message: '장바구니 수정 성공',
      data: null,
    };
  }
}
