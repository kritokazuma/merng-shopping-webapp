import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Item } from 'src/items/items.schema';

@Schema()
export class RegionNTownship {
  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  township: string;

  @Prop()
  address: string;
}

@Schema({ _id: false })
class SingleItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Item.name })
  itemId: MongooseSchema.Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop({ default: 'pending' })
  status?: string;
}

@Schema({ _id: false })
class CartItems {
  @Prop([SingleItem])
  items: SingleItem[];

  @Prop({ type: String, default: new Date().toLocaleString() })
  createdAt?: string;

  @Prop()
  location: RegionNTownship;

  @Prop({ default: 'pending' })
  status?: string;
}

@Schema()
export class Cart extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: MongooseSchema.Types.ObjectId;

  @Prop([CartItems])
  cart: Array<CartItems>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
