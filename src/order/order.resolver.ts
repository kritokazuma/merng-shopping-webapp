import { Resolver, Query, Args } from '@nestjs/graphql';
import { FilterItemInput } from 'src/items/dto/filter-item.input';
import { OrderEntities } from './entities/order.entities';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderEntities])
  async getOrders(@Args('filterItemInput') filterItemInput: FilterItemInput) {
    return await this.orderService.getOrders(filterItemInput);
  }

  @Query(() => OrderEntities)
  async getOrder(@Args('id') id: string) {
    return await this.orderService.getOrder(id);
  }
}
