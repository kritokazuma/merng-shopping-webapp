import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { CreateItemInput } from './dto/create-item.input';
import { Item } from './items.schema';
import { UserService } from 'src/user/user.service';
import { ForbiddenError } from 'apollo-server-express';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    private userService: UserService,
  ) {}

  async create(
    createItemInput: CreateItemInput,
    jwtDecodeReturnDto: JwtDecodeReturnDto,
  ) {
    if (jwtDecodeReturnDto.role !== 'seller')
      throw new ForbiddenError('u must be seller');

    const Item = new this.itemModel({
      ...createItemInput,
      seller: jwtDecodeReturnDto.id,
    });

    await Item.save();
    return 'created';
  }

  async getItems() {
    const checkItem = await this.itemModel
      .find()
      .populate({ path: 'seller', select: 'name' });
    console.log(checkItem);
    // console.log(checkItem);
  }
}
