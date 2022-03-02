import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Comment } from 'src/comment/comment.schema';

@Schema()
export class Reply extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Comment.name })
  commentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Reply.name })
  replyId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  comment: string;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
