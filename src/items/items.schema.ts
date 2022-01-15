import { Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

export type ItemDocument = Item & mongoose.Document;

class WarrentyStatus {
  @Prop()
  isAvailable: boolean;

  @Prop()
  sevenDaysReturns: boolean;
}

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

//[{q: q, s: s}]
class Comment {
  @Prop()
  question: Sender;

  @Prop({ default: null })
  answer: Sender;
}

export class Item {
  @Prop()
  label: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop()
  warrenty: WarrentyStatus;

  @Prop()
  ratings: UserRatings[];

  @Prop()
  comments: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  seller: User;

  @Prop({ type: Date, default: new Date().toISOString() })
  createdAt: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
