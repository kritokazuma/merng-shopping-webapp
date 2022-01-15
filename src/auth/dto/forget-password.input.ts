import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ForgetPasswordInput {
  @Field(() => String)
  email: string;
}
