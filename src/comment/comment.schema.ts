import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { Item } from 'src/items/items.schema';
import { User } from 'src/user/user.schema';

@Schema({ _id: false })
class Replys {
  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: Reply.name })
  replyId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  createdAt: string;
}

@Schema()
export class Comment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Item.name })
  itemId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  comment: string;

  @Prop([Replys])
  reply?: Replys[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
