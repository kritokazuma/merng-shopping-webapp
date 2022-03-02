import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { FilterItemInput } from './dto/filter-item.input';
import { ItemsEntities } from './entities/items.entities';
import { ItemsService } from './items.service';
import { SearchInput } from './dto/search.input';
import { Roles } from 'src/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { CreateItemInput } from 'src/items/dto/create-item.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Item } from './items.schema';
import { UpdateItemInput } from 'src/items/dto/update-item.input';
import { OrderService } from 'src/order/order.service';

@Resolver()
export class ItemsResolver {
  constructor(
    private itemsService: ItemsService,
    private orderService: OrderService,
  ) {}

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

  /**
   * Create Items
   * @param createItemInput item enities
   * @param file image files
   * @param context user
   * @returns Item
   */
  @Mutation(() => ItemsEntities)
  @Roles('seller', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createItem(
    @Args('createItemInput')
    createItemInput: CreateItemInput,
    @Args({ name: 'file', type: () => [GraphQLUpload] })
    file: Promise<FileUpload>[],
    @Context() context,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, context.req.user, file);
  }

  /**
   * Delete Item by id
   * @param id item id
   * @param context user
   * @returns string
   */
  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  async deleteItem(@Args('id') id: string, @Context() context) {
    return await this.itemsService.deleteItem(id, context.req.user);
  }

  /**
   * Update Item By Seller
   * @param updateItemInput label, price, description, etc..
   * @param files image files
   * @param context user
   * @returns Item
   */
  @Mutation(() => ItemsEntities)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @Args({ name: 'file', type: () => [GraphQLUpload], nullable: true })
    files: Promise<FileUpload>[],
    @Context() context,
  ): Promise<Item> {
    return await this.itemsService.updateItem(
      updateItemInput,
      files,
      context.req.user,
    );
  }
}
