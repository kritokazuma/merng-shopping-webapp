import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document, Mongoose } from 'mongoose';
import { Item } from 'src/items/items.schema';
import { User } from 'src/user/user.schema';

// @Schema({ _id: false })
// class Reply {
//   @Prop({ type: MongooseSchema.Types.ObjectId })
//   comment: MongooseSchema.Types.ObjectId;
// }

@Schema()
export class Comment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Item.name,
  })
  itemId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  comment: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId] })
  reply?: MongooseSchema.Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
