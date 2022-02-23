import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { FilterItemInput } from 'src/items/dto/filter-item.input';
import { UpdateStatusInput } from 'src/seller/dto/update-status.input';
import { Order } from './order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async getOrders(filterItemInput: FilterItemInput) {
    return await this.orderModel
      .find()
      .populate('sellerId', ['name', 'username', 'email', 'phone'])
      .populate('buyerId', ['name', 'username', 'email', 'phone'])
      .skip(filterItemInput.skip)
      .limit(filterItemInput.limit);
  }

  async getOrder(id: string) {
    return await this.orderModel
      .findById(id)
      .populate('sellerId', ['name', 'username', 'email', 'phone'])
      .populate('buyerId', ['name', 'username', 'email', 'phone']);
  }
}
