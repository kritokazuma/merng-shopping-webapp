import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CatagoryInput {
  @Field(() => [String])
  catagory: string[];
}
