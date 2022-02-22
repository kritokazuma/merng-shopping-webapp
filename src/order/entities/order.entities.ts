import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RegionAndTownship } from 'src/items/entities/items.entities';

@ObjectType()
class User {
  @Field(() => String)
  name: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;
}

@ObjectType()
export class OrderEntities {
  @Field(() => String)
  _id: string;

  @Field(() => User)
  sellerId: User;

  @Field(() => User)
  buyerId: User;

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
