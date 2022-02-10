import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
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
      throw new GraphQLError(err);
    });
    if (!User.location) throw new GraphQLError('add address first');

    /**
     * check collection and create Cart and Order collections
     * @param cartInput create cart input from user
     * @param reduce reduce function to reduce quantity of item from item collection
     * @param createCart create cart collection or if it has, push to collection
     * @param orderAdd create order collection of seller
     */
    const createCartAndOrderFunc = (
      cartInput: CreateCartInput,
      reduce?,
      createCart?,
      orderAdd?,
    ) => {
      try {
        cartInput.items.forEach(async (item) => {
          const SingleItem: any = await this.itemModel
            .findById(item.itemId)
            .populate('seller', '_id');

          if (!SingleItem || SingleItem.quantity <= 0)
            throw new GraphQLError('item not found');

          reduce && reduce(SingleItem, item.quantity);
          createCart && createCart(this.cartModel);
          orderAdd &&
            orderAdd(
              item.itemId,
              SingleItem.seller._id,
              item.quantity,
              this.orderModel,
            );
        });
      } catch (err) {
        throw new GraphQLError(err);
      }
    };

    /**
     * reduce quantity from item
     * @param item item from find method
     * @param quantity quantity of item
     */
    async function reduceQuantity(item: Item, quantity): Promise<void> {
      item.quantity = item.quantity - quantity;
      await item.save();
    }

    //If there is a cart in collection, push to cart. If doesn't create new one
    async function addItemToCart(cartModel: Model<Cart>): Promise<void> {
      try {
        const checkCart = await cartModel.findOne({ user: user.id });
        //if cart, push to collection
        if (checkCart) {
          checkCart.cart.push(createCartInput);
          await checkCart.save();
        } else {
          //create new collection
          const addToCart = new cartModel({
            user: user.id,
            cart: [createCartInput],
          });
          await addToCart.save();
        }
      } catch (err) {
        throw new GraphQLError(err);
      }
    }

    /**
     * add item to order
     * @param itemId itemId
     * @param sellerId sellerId
     * @param quantity quantity of item
     * @param orderModel collection model of order
     */
    async function addToOrderAndAllOrders(
      itemId,
      sellerId,
      quantity,
      orderModel: Model<Order>,
    ): Promise<void> {
      const newOrder = new orderModel({
        sellerId: sellerId,
        buyerId: user.id,
        itemId,
        quantity,
        location: createCartInput.location,
      });

      await newOrder.save();
    }

    //check item is available or not
    createCartAndOrderFunc(createCartInput);

    //check, reduce, add to cart and add order collection
    createCartAndOrderFunc(
      createCartInput,
      reduceQuantity,
      addItemToCart,
      addToOrderAndAllOrders,
    );

    return 'added to list';
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
