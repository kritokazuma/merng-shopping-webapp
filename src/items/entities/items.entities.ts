import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Schema } from 'mongoose';
import { CommentEntities } from 'src/comment/entities/comment.entities';

@ObjectType()
class UserRatings {
  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  review?: string;

  @Field(() => Int, { nullable: true })
  rating?: number;
}

@ObjectType()
export class RegionAndTownship {
  @Field(() => String)
  region: string;

  @Field(() => String)
  township: string;

  @Field(() => String)
  address: string;
}

@ObjectType()
class SellerDetails {
  @Field(() => String)
  _id: Schema.Types.ObjectId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  avatar: string;

  @Field(() => String)
  phone: string;

  @Field(() => RegionAndTownship)
  location: RegionAndTownship;
}

@ObjectType()
export class ItemsEntities {
  @Field(() => String)
  _id: Schema.Types.ObjectId;

  @Field(() => String)
  label: string;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  images: string[];

  @Field(() => [String])
  catagory: string[];

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Boolean)
  isAvailable: boolean;

  @Field(() => Boolean)
  warrenty: boolean;

  @Field(() => [UserRatings], { nullable: true })
  ratings?: UserRatings[];

  @Field(() => [CommentEntities], { nullable: true })
  comments?: CommentEntities[];

  @Field(() => SellerDetails)
  seller: SellerDetails;

  @Field(() => String)
  createdAt: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
