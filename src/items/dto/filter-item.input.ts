import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterItemInput {
  @Field(() => [String], { nullable: true })
  catagory?: string[];

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  skip: number;
}
