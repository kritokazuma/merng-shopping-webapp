import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Schema as MongooseSchema } from 'mongoose';
import { Item } from 'src/items/items.schema';

export type UserDocument = User & Document;

@Schema()
class RegionNTownship {
  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  township: string;

  @Prop()
  address: string[];
}

@Schema()
class OrderItemAndStatus {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Item })
  item: string;

  @Prop({ default: 'ordered' })
  status: string;
}

@Schema()
export class User extends Document {
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

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Item' }],
  })
  items: Item[];

  @Prop({ type: Date, default: new Date().toISOString() })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = model('UserModel', UserSchema);
