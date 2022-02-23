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

  @MinLength(6, {
    message: 'username must not be less than 6 characters',
  })
  @Field(() => String)
  username: string;

  @MinLength(6, {
    message: 'password must not be less than 6 characters',
  })
  @Field(() => String)
  password: string;

  @Field(() => String)
  dateOfBirth?: string;

  @Field(() => String)
  gender?: string;

  @Field(() => String)
  phone?: string;
}
