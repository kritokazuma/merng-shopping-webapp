import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Item } from 'src/items/items.schema';

@Schema()
class SingleItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Item.name })
  itemId: MongooseSchema.Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: Date })
  createdAt: string;
}

@Schema()
export class Cart extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: MongooseSchema.Types.ObjectId;

  @Prop()
  cart: SingleItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
