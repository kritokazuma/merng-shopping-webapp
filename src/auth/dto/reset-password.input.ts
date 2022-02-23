import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @IsNotEmpty()
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @Field(() => String)
  confirmPassword: string;
}
