import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { Item } from 'src/items/items.schema';
import { Cart } from './cart.schema';
import { CreateCartInput } from '../buyer/dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { User } from 'src/user/user.schema';
import { Order } from 'src/order/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async create(
    createCartInput: CreateCartInput,
    user: JwtDecodeReturnDto,
  ): Promise<string> {
    const User = await this.userModel.findById(user.id).catch((err) => {
      throw new UserInputError(err);
    });
    if (!User.location) throw new UserInputError('add address first');

    const itemIdArray = createCartInput.items.map((item) => {
      return item.itemId;
    });

    const checkItems = await this.itemModel.find().where('_id').in(itemIdArray);

    if (checkItems.length !== createCartInput.items.length)
      throw new ApolloError('item not found');

    //---------create new cart and save
    const cart = new this.cartModel({
      userId: user.id,
      cart: [createCartInput],
    });
    await cart.save();
    //----------end-------------------

    /**
     * map items and create new orders
     */
    checkItems.map(async (item) => {
      //find to get "quantity" from "createCartInput" array
      const findQuantity: { itemId: string; quantity: number } =
        createCartInput.items.find((i) => i.itemId == item._id.toString());

      //reduce quantity and save
      item.quantity = findQuantity.quantity;
      await item.save();

      //create new order and save
      const newOrder = new this.orderModel({
        sellerId: item.seller,
        buyerId: user.id,
        itemId: item._id,
        cartId: cart._id,
        quantity: findQuantity.quantity,
        location: createCartInput.location,
      });

      await newOrder.save();
    });

    return 'added to list';
  }

  async findAll(user: JwtDecodeReturnDto) {
    return await this.cartModel.find({ userId: user.id }).populate({
      path: 'cart',
      populate: {
        path: 'items',
        populate: 'itemId',
      },
    });
  }

  async findOne(cartId: string, user: JwtDecodeReturnDto) {
    const cart = await this.cartModel.findById(cartId).populate({
      path: 'cart',
      populate: {
        path: 'items',
        populate: 'itemId',
      },
    });
    if (cart.userId.toString() === user.id) {
      return cart;
    }
    throw new ApolloError('u must be buyer of this cart');
  }
}
