import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthInput {
  @Field(() => String)
  name?: string;

  @Field(() => String)
  email?: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  dateOfBirth?: string;

  @Field(() => String)
  gender?: string;

  @Field(() => String)
  phone?: string;
}
