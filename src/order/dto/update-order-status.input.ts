import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateOrderStatusInput {
  @IsNotEmpty()
  @Field(() => String)
  orderId: string;

  @IsNotEmpty()
  @Field(() => String)
  status: string;
}
