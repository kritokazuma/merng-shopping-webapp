import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  label?: string;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Field(() => [Int], { nullable: true })
  removedImage?: number[];
}
