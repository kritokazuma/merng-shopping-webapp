import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { UpdateStatusInput } from 'src/seller/dto/update-status.input';
import { Order } from './order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async getOrders() {
    return await this.orderModel.find();
  }

  async updateStatus(
    updateStatusInput: UpdateStatusInput,
    user: JwtDecodeReturnDto,
  ) {}
}
