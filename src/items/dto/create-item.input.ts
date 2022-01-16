import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  label: string;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  images: string[];

  @Field(() => [String])
  catagory: string[];

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Boolean)
  warrenty: boolean;
}
