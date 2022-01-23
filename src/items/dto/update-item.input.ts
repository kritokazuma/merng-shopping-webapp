import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  label?: string;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Field(() => String, { nullable: true })
  images?: string;
}
