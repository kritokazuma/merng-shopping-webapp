import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { Model, Schema } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { Item } from 'src/items/items.schema';
import { User } from 'src/user/user.schema';
import { Cart } from './cart.schema';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async create(createCartInput: CreateCartInput, user: JwtDecodeReturnDto) {
    // const createCartFunc = (cartInput: CreateCartInput, cb?: Function) => {
    //   cartInput.items.forEach(async (item) => {
    //     const SingleItem = await this.itemModel.findById(item.itemId);
    //     if (!SingleItem || SingleItem.quantity <= 0)
    //       throw new GraphQLError('item not found');
    //     if (cb) cb(SingleItem, item.quantity);
    //   });
    // };

    // async function reduceQuantity(item: Item, quantity): Promise<void> {
    //   item.quantity = item.quantity - quantity;
    //   await item.save();
    // }

    // createCartFunc(createCartInput);
    // createCartFunc(createCartInput, reduceQuantity);

    interface CartType {
      itemId: Schema.Types.ObjectId;
      quantity: number;
      status: string;
      createdAt: string;
    }

    const checkCart = await this.cartModel.findOne({ user: user.id });
    const addStatusAndDateToArray: any = createCartInput.items.map((item) => {
      item.status = 'pending';
      item.createdAt = new Date().toISOString();
      return item;
    });
    console.log(addStatusAndDateToArray);
    if (!checkCart) {
      const addToCart = new this.cartModel({
        user: user.id,
        cart: [...addStatusAndDateToArray],
      });
      await addToCart.save();
      return 'add to list';
    }
    checkCart.cart.push(...addStatusAndDateToArray);
    checkCart.save();
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartInput: UpdateCartInput) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
