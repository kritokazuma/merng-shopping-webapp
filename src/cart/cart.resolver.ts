import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { Roles } from 'src/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer')
  async createCart(
    @Args('createCartInput') createCartInput: CreateCartInput,
    @Context() context,
  ) {
    return await this.cartService.create(createCartInput, context.req.user);
  }

  @Query(() => [Cart], { name: 'cart' })
  findAll() {
    return this.cartService.findAll();
  }

  @Query(() => Cart, { name: 'cart' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cartService.findOne(id);
  }

  @Mutation(() => Cart)
  updateCart(@Args('updateCartInput') updateCartInput: UpdateCartInput) {
    return this.cartService.update(updateCartInput.id, updateCartInput);
  }

  @Mutation(() => Cart)
  removeCart(@Args('id', { type: () => Int }) id: number) {
    return this.cartService.remove(id);
  }
}
