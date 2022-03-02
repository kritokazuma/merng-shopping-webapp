import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OrderFilterInput {
  @Field(() => String)
  status: string;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  limit: number;
}
