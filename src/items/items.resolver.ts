import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CatagoryInput } from './dto/catagory.input';
import { CreateItemInput } from './dto/create-item.input';
import { ItemEntitiesReturn } from './entities/items.entities';
import { ItemsAuthGuard } from './items.guards';
import { ItemsService } from './items.service';
import { Roles } from './roles.decorator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { finished } from 'stream';
import { dirname } from 'path';

@Resolver()
export class ItemsResolver {
  constructor(private itemsService: ItemsService) {}

  /*------------Query Items----------------*/
  @Query(() => [ItemEntitiesReturn])
  async getItems() {
    return await this.itemsService.getItems();
  }

  @Query(() => [ItemEntitiesReturn])
  async getItemsByCatagory(
    @Args('catagoryInput') catagoryInput: CatagoryInput,
  ) {
    return await this.itemsService.getItemsByCatagory(catagoryInput);
  }

  @Query(() => ItemEntitiesReturn)
  async getItemById(@Args('id') id: string) {
    return await this.itemsService.getItemById(id);
  }
  /*------------End of Query Items----------------*/

  @Mutation(() => ItemEntitiesReturn)
  @UseGuards(JwtAuthGuard, ItemsAuthGuard)
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
  @UseGuards(JwtAuthGuard, ItemsAuthGuard)
  @Roles('seller', 'admin')
  async deleteItem(@Args('id') id: string, @Context() context) {
    return await this.itemsService.deleteItem(id, context.req.user);
  }

  @Mutation(() => String)
  async imageUpload(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { filename, createReadStream }: FileUpload,
  ) {
    console.log(filename);
    const out = createWriteStream(`./src/images/${filename}`);
    const steam = createReadStream();
    steam.pipe(out);
    return 'success';
  }
}
