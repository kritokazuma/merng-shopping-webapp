import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtDecodeReturnDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  avatar: string;
}
