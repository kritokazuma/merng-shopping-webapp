import { Injectable } from '@nestjs/common';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class BuyerService {
  constructor(private readonly cartService: CartService) {}

  async getCart(cartId: string, user: JwtDecodeReturnDto) {
    const cart = await this.cartService.findOne(cartId);
    if (!cart) throw new UserInputError('cart not found');
    if (cart.userId.toString() === user.id) {
      return cart;
    }
    throw new ApolloError('u must be buyer of this cart');
  }
}
