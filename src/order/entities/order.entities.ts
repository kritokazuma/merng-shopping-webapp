import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RegionAndTownship } from 'src/items/entities/items.entities';

@ObjectType()
export class OrderEntities {
  @Field(() => String)
  sellerId: string;

  @Field(() => String)
  buyerId: string;

  @Field(() => String)
  itemId: string;

  @Field(() => String)
  cartId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => String)
  status?: string;

  @Field(() => RegionAndTownship)
  location: RegionAndTownship;

  @Field(() => String)
  createdAt?: string;

  processFinishTime?: string;
}
