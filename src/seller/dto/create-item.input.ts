import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayNotEmpty, IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateItemInput {
  @IsNotEmpty()
  @Field(() => String)
  label: string;

  @IsNotEmpty()
  @Field(() => String)
  description: string;

  @ArrayNotEmpty()
  @Field(() => [String])
  catagory: string[];

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  quantity: number;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  warrenty: boolean;
}
