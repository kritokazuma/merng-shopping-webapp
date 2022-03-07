import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Comment } from 'src/comment/comment.schema';
import { User } from 'src/user/user.schema';

@Schema()
class UserRatings {
  @Prop()
  username: string;

  @Prop()
  review: string;

  @Prop()
  rating: number;
}

@Schema()
export class Item extends Document {
  @Prop()
  label: string;

  @Prop()
  description: string;

  @Prop()
  images: string[];

  @Prop()
  catagory: string[];

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop()
  warrenty: boolean;

  @Prop()
  ratings: UserRatings[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  seller: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, default: new Date().toLocaleString() })
  createdAt: string;

  @Prop({ type: Date })
  updatedAt?: string;

  //to add comments
  comments?: Comment[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
ItemSchema.index({ label: 'text' });
