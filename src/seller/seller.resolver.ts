import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { ItemEntitiesReturn } from 'src/items/entities/items.entities';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Args, Context, Mutation } from '@nestjs/graphql';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { CreateItemInput } from 'src/seller/dto/create-item.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ItemsService } from 'src/items/items.service';
import { UpdateItemInput } from 'src/seller/dto/update-item.input';

@Resolver()
export class SellerResolver {
  constructor(
    private itemsService: ItemsService,
    private sellerService: SellerService,
  ) {}

  @Mutation(() => ItemEntitiesReturn)
  @Roles('seller', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  async deleteItem(@Args('id') id: string, @Context() context) {
    return await this.itemsService.deleteItem(id, context.req.user);
  }

  @Mutation(() => ItemEntitiesReturn)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
