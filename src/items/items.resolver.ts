import { SetMetadata, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateItemInput } from './dto/create-item.input';
import { ItemEntitiesReturn } from './entities/items.entities';
import { ItemsAuthGuard } from './items.guards';
import { ItemsService } from './items.service';

@Resolver()
export class ItemsResolver {
  constructor(private itemsService: ItemsService) {}

  @Query(() => String)
  getItems() {
    return this.itemsService.getItems();
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, ItemsAuthGuard) //TODO
  @SetMetadata('roles', ['admin', 'seller'])
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @Context() context,
  ) {
    return this.itemsService.create(createItemInput, context.req.user);
  }
}
