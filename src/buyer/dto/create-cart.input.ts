import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class RegionNTownship {
  @Field(() => String)
  region: string;

  @Field(() => String)
  township: string;

  @Field(() => String)
  address: string;
}

@InputType()
class SingleItem {
  @Field(() => String)
  itemId: string;

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
