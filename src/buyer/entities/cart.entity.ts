import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  ItemsEntities,
  RegionAndTownship,
} from 'src/items/entities/items.entities';

@ObjectType()
class SingleCartItem {
  @Field(() => ItemsEntities)
  itemId: ItemsEntities;

  @Field(() => Int)
  quantity: number;

  @Field(() => String)
  status: string;
}

@ObjectType()
class CartItems {
  @Field(() => [SingleCartItem])
  items: SingleCartItem[];

  @Field()
  location: RegionAndTownship;

  @Field(() => String)
  status: string;

  @Field(() => String, { nullable: true })
  processFinishTime?: string;
}

@ObjectType()
export class CartEntities {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  userId: string;

  @Field(() => CartItems)
  cart: CartItems;

  @Field(() => String)
  createdAt: string;
}
