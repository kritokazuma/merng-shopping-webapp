import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilterItemInput } from 'src/items/dto/filter-item.input';
import { UpdateOrderStatusInput } from 'src/order/dto/update-order-status.input';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { OrderFilterInput } from './dto/order-filter.input';
import { OrderEntities } from './entities/order.entities';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderEntities])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getOrders(@Args('orderFilterInput') orderFilterInput: OrderFilterInput) {
    return this.orderService.getOrders(orderFilterInput);
  }

  @Query(() => [OrderEntities])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Query(() => OrderEntities)
  getOrder(@Args('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Query(() => [OrderEntities])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  getSellerOrders(
    @Args('orderFilterInput') orderFilterInput: OrderFilterInput,
    @Context() context,
  ) {
    return this.orderService.getSellerOrders(
      orderFilterInput,
      context.req.user,
    );
  }

  /**
   * UpdateOrderStatus by seller
   * @param updateStatusInput id, status
   * @param context user
   * @returns string 'updated'
   */
  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  async updateOrderStatus(
    @Args('updateStatusInput') updateOrderStatusInput: UpdateOrderStatusInput,
    @Context() context,
  ) {
    return this.orderService.updateOrderStatus(
      updateOrderStatusInput,
      context.req.user,
    );
  }
}
