import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginAuthInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
