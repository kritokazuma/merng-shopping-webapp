import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CartService } from 'src/cart/cart.service';
import { CreateCartInput } from 'src/buyer/dto/create-cart.input';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { CartEntities } from './entities/cart.entity';
import { BuyerService } from './buyer.service';
import { Cart } from 'src/cart/cart.schema';

@Resolver()
export class BuyerResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly buyerService: BuyerService,
  ) {}

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
  ): Promise<string | void> {
    return await this.cartService.create(createCartInput, context.req.user);
  }

  @Query(() => [CartEntities])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer')
  async getCarts(@Context() context) {
    const carts = await this.cartService.findAll(context.req.user);
    console.log(carts);
    return carts;
  }

  @Query(() => CartEntities)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer', 'admin')
  async getCart(
    @Args('cartId') cartId: string,
    @Context() context,
  ): Promise<Cart> {
    return await this.buyerService.getCart(cartId, context.req.user);
  }
}
