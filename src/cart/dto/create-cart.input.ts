import { InputType, Int, Field } from '@nestjs/graphql';
import { Schema } from 'mongoose';

@InputType()
export class RegionNTownship {
  @Field()
  region: string;

  @Field()
  township: string;

  @Field()
  address: string;
}

@InputType()
class SingleItem {
  @Field(() => String)
  itemId: Schema.Types.ObjectId;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateCartInput {
  @Field(() => [SingleItem])
  items: SingleItem[];

  @Field(() => RegionNTownship)
  location: RegionNTownship;
}
