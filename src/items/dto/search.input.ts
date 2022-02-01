import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchInput {
  @Field(() => String)
  input: string;

  @Field(() => Int, { nullable: true })
  priceRange?: number;
}
