import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddressInput {
  @Field()
  region: string;

  @Field()
  township: string;

  @Field()
  address: string;
}
