import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

export type ItemDocument = Item & mongoose.Document;

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
export class Item {
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  seller: User;

  @Prop({ type: Date, default: new Date().toISOString() })
  createdAt: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
