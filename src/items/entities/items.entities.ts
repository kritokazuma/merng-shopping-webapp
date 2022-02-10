import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class UserRatings {
  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  review?: string;

  @Field(() => Int, { nullable: true })
  rating?: number;
}

//Sender and Comment
@ObjectType()
class Sender {
  @Field(() => String)
  sendBy: string;

  @Field(() => String)
  comment: string;
}

@ObjectType()
class Comment {
  @Field(() => Sender, { nullable: true })
  question?: Sender;

  @Field(() => Sender, { nullable: true })
  answer?: Sender;
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
  _id: string;

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
export class ItemEntitiesReturn {
  @Field(() => String)
  _id: any;

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

  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @Field(() => SellerDetails)
  seller: SellerDetails;

  @Field(() => String)
  createdAt: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}
