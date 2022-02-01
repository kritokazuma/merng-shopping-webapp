import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilterItemInput } from './dto/filter-item.input';
import { CreateItemInput } from './dto/create-item.input';
import { ItemEntitiesReturn } from './entities/items.entities';
import { SellerRoleGuard } from './seller.guards';
import { ItemsService } from './items.service';
import { Roles } from './roles.decorator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UpdateItemInput } from './dto/update-item.input';
import { SearchInput } from './dto/search.input';

@Resolver()
export class ItemsResolver {
  constructor(private itemsService: ItemsService) {}

  /*------------Query Items----------------*/
  @Query(() => [ItemEntitiesReturn])
  async getItems(@Args('filterItemInput') filterItemInput: FilterItemInput) {
    return await this.itemsService.getItems(filterItemInput);
  }

  @Query(() => [ItemEntitiesReturn])
  async getItemsByCatagory(
    @Args('catagoryInput') catagoryInput: FilterItemInput,
  ) {
    return await this.itemsService.getItemsByCatagory(catagoryInput);
  }

  @Query(() => [ItemEntitiesReturn])
  async getItemRandomly() {
    return await this.itemsService.getItemRandomly();
  }

  @Query(() => ItemEntitiesReturn)
  async getItemById(@Args('id') id: string) {
    return await this.itemsService.getItemById(id);
  }

  @Query(() => [ItemEntitiesReturn])
  async getItemBySearch(@Args('searchInput') searchInput: SearchInput) {
    return await this.itemsService.getItemBySearch(searchInput);
  }
  /*------------End of Query Items----------------*/

  @Mutation(() => ItemEntitiesReturn)
  @UseGuards(JwtAuthGuard, SellerRoleGuard)
  @Roles('seller', 'admin')
  createItem(
    @Args('createItemInput')
    createItemInput: CreateItemInput,
    @Args({ name: 'file', type: () => [GraphQLUpload] })
    file: Promise<FileUpload>[],
    @Context() context,
  ) {
    return this.itemsService.create(createItemInput, context.req.user, file);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, SellerRoleGuard)
  @Roles('seller', 'admin')
  async deleteItem(@Args('id') id: string, @Context() context) {
    return await this.itemsService.deleteItem(id, context.req.user);
  }

  @Mutation(() => ItemEntitiesReturn)
  @UseGuards(JwtAuthGuard, SellerRoleGuard)
  @Roles('seller', 'admin')
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @Args({ name: 'file', type: () => [GraphQLUpload], nullable: true })
    files: Promise<FileUpload>[],
    @Context() context,
  ) {
    return await this.itemsService.updateItem(
      updateItemInput,
      files,
      context.req.user,
    );
  }
}
