import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { ItemsEntities } from 'src/items/entities/items.entities';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Args, Context, Mutation } from '@nestjs/graphql';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { CreateItemInput } from 'src/seller/dto/create-item.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ItemsService } from 'src/items/items.service';
import { UpdateItemInput } from 'src/seller/dto/update-item.input';
import { Item } from 'src/items/items.schema';
import { UpdateStatusInput } from './dto/update-status.input';

@Resolver()
export class SellerResolver {
  constructor(
    private itemsService: ItemsService,
    private sellerService: SellerService,
  ) {}

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
   * Delete Item
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

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  async updateOrderStatus(
    @Args('updateStatusInput') updateStatusInput: UpdateStatusInput,
    @Context() context,
  ) {
    return this.sellerService.updateStatus(updateStatusInput, context.req.user);
  }
}
