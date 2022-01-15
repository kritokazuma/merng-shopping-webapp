import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ConfirmOtp {
  @Field(() => String)
  email: string;

  @Field(() => String)
  otp: string;
}
