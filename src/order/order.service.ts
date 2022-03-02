import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Model, Types } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { User } from 'src/user/user.schema';
import { OrderFilterInput } from './dto/order-filter.input';
import { Order } from './order.schema';
import { Cart } from 'src/cart/cart.schema';
import { UpdateOrderStatusInput } from 'src/order/dto/update-order-status.input';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async getOrders(orderFilterInput: OrderFilterInput) {
    return await this.orderModel
      .find()
      .populate('sellerId', ['name', 'username', 'email', 'phone'])
      .populate('buyerId', ['name', 'username', 'email', 'phone'])
      .skip(orderFilterInput.skip)
      .limit(orderFilterInput.limit);
  }

  async getOrder(id: string) {
    return await this.orderModel
      .findById(id)
      .populate('sellerId', ['name', 'username', 'email', 'phone'])
      .populate('buyerId', ['name', 'username', 'email', 'phone']);
  }

  async getSellerOrders(
    orderFilterInput: OrderFilterInput,
    user: JwtDecodeReturnDto,
  ) {
    const orders = await this.orderModel.aggregate([
      {
        $match: {
          $and: [
            { sellerId: new Types.ObjectId(user.id) },
            {
              status: orderFilterInput.status,
            },
          ],
        },
      },
      { $skip: orderFilterInput.skip },
      { $limit: orderFilterInput.limit },
    ]);

    //populate seller from orders
    await this.userModel.populate(orders, {
      path: 'sellerId',
      select: ['name', 'username', 'email', 'phone'],
    });

    //populate buyer from orders
    await this.userModel.populate(orders, {
      path: 'buyerId',
      select: ['name', 'username', 'email', 'phone'],
    });
    return orders;
  }

  async updateOrderStatus(
    updateOrderStatusInput: UpdateOrderStatusInput,
    user: JwtDecodeReturnDto,
  ) {
    //-------------update order status---------------------
    const order = await this.orderModel.findById(
      updateOrderStatusInput.orderId,
    );
    if (!order) throw new UserInputError('item not found');
    if (order.sellerId.toString() == user.id) {
      order.status = updateOrderStatusInput.status;
      await order.save();
    } else {
      throw new AuthenticationError('You are not seller of this item');
    }
    //----------------------end------------------------------

    //--------------update cart status-----------------------
    const cart = await this.cartModel.findById(order.cartId);
    const findItemIndex = cart.cart.items.findIndex(
      (i) => order.itemId.toString() === i.itemId.toString(),
    );
    cart.cart.items[findItemIndex].status = updateOrderStatusInput.status;
    console.log(findItemIndex);
    await cart.save();
    //-----------------------end-----------------------------
    return 'updated';
  }
}
