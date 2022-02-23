import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateStatusInput {
  @IsNotEmpty()
  @Field(() => String)
  id: string;

  @IsNotEmpty()
  @Field(() => String)
  status: string;
}
