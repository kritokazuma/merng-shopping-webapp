import { Resolver, Query, Args } from '@nestjs/graphql';
import { FilterItemInput } from './dto/filter-item.input';
import { ItemsEntities } from './entities/items.entities';
import { ItemsService } from './items.service';
import { SearchInput } from './dto/search.input';

@Resolver()
export class ItemsResolver {
  constructor(private itemsService: ItemsService) {}

  /*------------Query Items----------------*/
  @Query(() => [ItemsEntities])
  async getItems(@Args('filterItemInput') filterItemInput: FilterItemInput) {
    return await this.itemsService.getItems(filterItemInput);
  }

  @Query(() => [ItemsEntities])
  async getItemsByCatagory(
    @Args('catagoryInput') catagoryInput: FilterItemInput,
  ) {
    return await this.itemsService.getItemsByCatagory(catagoryInput);
  }

  @Query(() => [ItemsEntities])
  async getItemRandomly() {
    return await this.itemsService.getItemRandomly();
  }

  @Query(() => ItemsEntities)
  async getItemById(@Args('id') id: string) {
    return await this.itemsService.getItemById(id);
  }

  @Query(() => [ItemsEntities])
  async getItemBySearch(@Args('searchInput') searchInput: SearchInput) {
    return await this.itemsService.getItemBySearch(searchInput);
  }
  /*------------End of Query Items----------------*/
}
