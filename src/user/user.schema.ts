import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class RegionNTownship {
  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  township: string;

  @Prop()
  address: string;
}

interface MongoDbPrefix {
  _doc: any;
}

@Schema()
export class User extends Document implements MongoDbPrefix {
  _doc: any;
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

  @Prop([RegionNTownship])
  location: RegionNTownship[];

  @Prop({ default: 'image/default' })
  avatar: string;

  @Prop({ type: Date })
  dateOfBirth: string;

  @Prop()
  gender: string;

  @Prop({ default: 'buyer' })
  role: string;

  @Prop({ type: Date, default: new Date().toISOString() })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
