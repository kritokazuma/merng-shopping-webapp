import { InputType, Int, Field } from '@nestjs/graphql';
import { Schema } from 'mongoose';

@InputType()
class SingleItem {
  @Field(() => String)
  itemId: Schema.Types.ObjectId;

  @Field(() => Int)
  quantity: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;
}

@InputType()
export class CreateCartInput {
  @Field(() => [SingleItem])
  items: SingleItem[];

  @Field(() => [Int], { description: 'Example field (placeholder)' })
  address: number[];
}
