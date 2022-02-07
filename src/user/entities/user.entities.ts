import { Field, ObjectType } from '@nestjs/graphql';
import { RegionAndTownship } from 'src/items/entities/items.entities';

@ObjectType()
export class UserEntities {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  dateOfBirth: string;

  @Field(() => String)
  gender: string;

  @Field(() => String)
  role: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => [RegionAndTownship])
  location: RegionAndTownship[];
}
