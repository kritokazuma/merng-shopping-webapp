import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RegionNTownship } from 'src/user/user.schema';
import { Item } from 'src/items/items.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  sellerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  buyerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Item.name })
  itemId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ default: 'pending' })
  status?: string;

  @Prop({ type: RegionNTownship })
  location: RegionNTownship;

  @Prop({ default: new Date().toLocaleString() })
  createdAt?: string;

  @Prop({ type: String })
  processFinishTime?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
