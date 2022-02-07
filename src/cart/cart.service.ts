import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { Item } from 'src/items/items.schema';
import { Cart } from './cart.schema';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { User } from 'src/user/user.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(
    createCartInput: CreateCartInput,
    user: JwtDecodeReturnDto,
  ): Promise<string> {
    const User = await this.userModel.findById(user.id).catch((err) => {
      throw new GraphQLError(err);
    });
    if (!User.location) throw new GraphQLError('add address first');

    const createCartFunc = (cartInput: CreateCartInput, cb?) => {
      cartInput.items.forEach(async (item) => {
        const SingleItem = await this.itemModel
          .findById(item.itemId)
          .catch((err) => {
            throw new GraphQLError(err);
          });

        if (!SingleItem || SingleItem.quantity <= 0)
          throw new GraphQLError('item not found');
        if (cb) cb(SingleItem, item.quantity);
      });
    };

    async function reduceQuantity(item: Item, quantity): Promise<void> {
      item.quantity = item.quantity - quantity;
      await item.save();
    }

    //check item is available or not
    createCartFunc(createCartInput);

    //check and reduce quantity
    createCartFunc(createCartInput, reduceQuantity);

    const checkCart = await this.cartModel.findOne({ user: user.id });

    //if cart, push to collection
    if (checkCart) {
      checkCart.cart.push(createCartInput);
      await checkCart.save();
    } else {
      //create new collection
      const addToCart = new this.cartModel({
        user: user.id,
        cart: [createCartInput],
      });
      await addToCart.save();
    }

    return 'add to list';
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
