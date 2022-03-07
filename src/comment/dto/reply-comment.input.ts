import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReplyCommentInput {
  @Field(() => String)
  commentId: string;

  @Field(() => String)
  comment: string;
}
