import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateAuthInput {
  @IsNotEmpty()
  @Field(() => String)
  name?: string;

  @IsEmail()
  @Field(() => String)
  email?: string;

  @Field(() => String)
  @MinLength(6, {
    message: 'username must not be less than 6 characters',
  })
  username: string;

  @Field(() => String)
  @MinLength(6, {
    message: 'password must not be less than 6 characters',
  })
  password: string;

  @Field(() => String)
  dateOfBirth?: string;

  @Field(() => String)
  gender?: string;

  @Field(() => String)
  phone?: string;
}
