import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthUserReturn {
  @Field(() => String)
  email: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  token: string;
}

@ObjectType()
export class forgetPasswordConfirmOtpReturn {
  @Field(() => String)
  token: string;
}
