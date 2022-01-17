import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/user.schema';

console.log(User.name);
class UserRatings {
  @Prop()
  username: string;

  @Prop()
  review: string;

  @Prop()
  rating: number;
}

//Sender and Comment
class Sender {
  @Prop()
  sendBy: string;

  @Prop()
  comment: string;
}

class Comment {
  @Prop()
  question: Sender;

  @Prop({ default: null })
  answer: Sender;
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

  @Prop()
  comments: Comment[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  seller: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, default: new Date().toISOString() })
  createdAt: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
