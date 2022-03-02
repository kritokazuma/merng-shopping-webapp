import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateItemInput {
  @IsNotEmpty()
  @Field(() => String)
  id: string;

  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  label?: string;

  @IsNotEmpty()
  @Field(() => Int, { nullable: true })
  price?: number;

  @IsNotEmpty()
  @Field(() => Int, { nullable: true })
  quantity?: number;

  @ArrayNotEmpty()
  @Field(() => [Int], { nullable: true })
  removedImage?: number[];
}
