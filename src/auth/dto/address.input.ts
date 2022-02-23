import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AddressInput {
  @IsNotEmpty()
  @Field()
  region: string;

  @IsNotEmpty()
  @Field()
  township: string;

  @IsNotEmpty()
  @Field()
  address: string;
}
