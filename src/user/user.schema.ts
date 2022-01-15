import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Item } from 'src/items/items.schema';

export type UserDocument = User & mongoose.Document;

class RegionNTownship {
  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  township: string;

  @Prop()
  address: string[];
}

class OrderItemAndStatus {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Item })
  item: string;

  @Prop({ default: 'ordered' })
  status: string;
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  location: RegionNTownship;

  @Prop({ default: 'image/default' })
  avatar: string;

  @Prop({ type: Date })
  dateOfBirth: string;

  @Prop()
  gender: string;

  @Prop({ default: 'buyer' })
  role: string;

  @Prop()
  orders: OrderItemAndStatus[];

  @Prop({ type: Date, default: new Date().toISOString() })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
