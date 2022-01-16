import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { CreateItemInput } from './dto/create-item.input';
import { Item, ItemDocument } from './items.schema';
import { UserService } from 'src/user/user.service';
import { ForbiddenError } from 'apollo-server-express';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
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

    const User = await this.userService.addItemToUser({
      userId: jwtDecodeReturnDto.id,
      itemId: Item.id,
    });
    await Item.save();
    return 'created';
  }

  async getItems() {

    // const checkItem = await this.itemModel
    //   .findById('61e31fdd4130065102205240')
    //   .populate({ path: 'seller', model: UserModel });
    // console.log('get');
    // console.log(checkItem);
  }
}
