import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class userDetails {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  avatar: string;
}

@ObjectType()
export class CommentEntities {
  @Field(() => String)
  _id: string;

  @Field(() => userDetails)
  userId: userDetails;

  @Field(() => String)
  itemId?: string;

  @Field(() => String)
  comment: string;

  @Field(() => [CommentEntities], { nullable: true })
  reply: CommentEntities[];
}
