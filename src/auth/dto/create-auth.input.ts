import { InputType, Int, Field } from '@nestjs/graphql';
import { isDate, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
    message: "username must not be less than 6 characters"
  })
  username: string;

  @Field(() => String)
  @MinLength(6, {
    message: "password must not be less than 6 characters"
  })
  password: string;

  @Field(() => String)
  dateOfBirth?: Date;

  @Field(() => String)
  gender?: string;

  @Field(() => String)
  phone?: string;
}
