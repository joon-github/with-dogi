import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { AddReviewDto } from './dto/addCartDto.dto';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { OptionsService } from '../options/options.service';
import { CartException } from './exceptions/cart-exceptions';
import { UpdateOptionDto } from './dto/updateOptionDto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    private readonly authService: AuthService,

    private readonly optionService: OptionsService,
  ) {}

  private async findMyCartItems(userId: number, cartId: number) {
    const cartItem = await this.cartRepository
      .createQueryBuilder('Cart')
      .where('Cart.userId = :userId', { userId: userId })
      .andWhere('Cart.cartId = :cartId', { cartId: cartId })
      .getMany();
    if (!cartItem) {
      throw new CartException(CartException.CART_NOT_FOUND);
    }
    return cartItem;
  }

  public async findCartByUserId(userId: number) {
    const cart = await this.cartRepository
      .createQueryBuilder('Cart')
      .where('Cart.userId = :userId', { userId: userId })
      .getMany();
    if (!cart) {
      throw new CartException(CartException.CART_EMPTY);
    }
    return cart;
  }

  async addCart(addCartDto: AddReviewDto, userId: number): Promise<void> {
    const user = await this.authService.findUserById(userId);
    const option = await this.optionService.findOptionByOptionId(
      addCartDto.optionId,
    );

    const cart = this.cartRepository.create({
      user: user,
      option: option,
      quantity: addCartDto.quantity,
    });

    await this.cartRepository.save(cart);
  }

  async deleteCart(cartId: number, userId: number): Promise<void> {
    const cart = await this.findMyCartItems(userId, cartId);
    await this.cartRepository.remove(cart);
  }

  async updateCart(
    cartId: number,
    updateCartDto: UpdateOptionDto,
    userId: number,
  ): Promise<void> {
    await this.findMyCartItems(userId, cartId);
    await this.cartRepository.update(cartId, updateCartDto);
  }
}
