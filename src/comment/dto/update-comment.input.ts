import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput {
  @Field(() => String)
  commentId: string;

  @Field(() => String)
  comment: string;
}
