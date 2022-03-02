import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

@InputType()
export class RegionNTownship {
  @IsNotEmpty()
  @Field(() => String)
  region: string;

  @IsNotEmpty()
  @Field(() => String)
  township: string;

  @IsNotEmpty()
  @Field(() => String)
  address: string;
}

@InputType()
class SingleItem {
  @IsNotEmpty()
  @Field(() => String)
  itemId: string;

  @IsNotEmpty()
  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateCartInput {
  @Field(() => [SingleItem])
  items: SingleItem[];

  @IsNotEmptyObject()
  @Field(() => RegionNTownship)
  location: RegionNTownship;
}
