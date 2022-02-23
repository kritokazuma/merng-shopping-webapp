import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationError } from 'apollo-server-express';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { Cart } from 'src/cart/cart.schema';
import { Order } from 'src/order/order.schema';
import { UpdateStatusInput } from './dto/update-status.input';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async updateStatus(
    updateStatusInput: UpdateStatusInput,
    user: JwtDecodeReturnDto,
  ) {
    //-------------update order status---------------------
    const order = await this.orderModel.findById(updateStatusInput.id);
    if (order.sellerId.toString() == user.id) {
      order.status = updateStatusInput.status;
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
    cart.cart.items[findItemIndex].status = updateStatusInput.status;
    console.log(findItemIndex);
    await cart.save();
    //-----------------------end-----------------------------
    return 'updated';
  }
}
