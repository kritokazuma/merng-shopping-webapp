import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateStatusInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  status: string;
}
