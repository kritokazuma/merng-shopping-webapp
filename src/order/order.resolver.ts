import { Resolver, Query, Args } from '@nestjs/graphql';
import { FilterItemInput } from 'src/items/dto/filter-item.input';
import { OrderEntities } from './entities/order.entities';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderEntities])
  getOrders(@Args('filterItemInput') filterItemInput: FilterItemInput) {
    return this.orderService.getOrders(filterItemInput);
  }

  @Query(() => OrderEntities)
  getOrder(@Args('id') id: string) {
    return this.orderService.getOrder(id);
  }
}
