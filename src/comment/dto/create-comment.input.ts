import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class CreateCommentInput {
  @Field(() => String)
  itemId: string;

  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => String)
  comment: string;
}
