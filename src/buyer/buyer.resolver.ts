import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CartService } from 'src/cart/cart.service';
import { CreateCartInput } from 'src/buyer/dto/create-cart.input';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';

@Resolver()
export class BuyerResolver {
  constructor(private readonly cartService: CartService) {}

  /**
   * Add Item to Buy list (cart)
   * @param createCartInput item credentials
   * @param context user
   * @returns String
   */
  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer')
  async createCart(
    @Args('createCartInput') createCartInput: CreateCartInput,
    @Context() context,
  ): Promise<string> {
    return await this.cartService.create(createCartInput, context.req.user);
  }
}
