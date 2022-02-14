import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateStatusInput {
  @Field(() => String)
  itemId: string;

  @Field(() => String)
  status: string;
}
