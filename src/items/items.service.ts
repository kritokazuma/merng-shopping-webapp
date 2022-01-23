import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { CreateItemInput } from './dto/create-item.input';
import { Item } from './items.schema';
import { UserService } from 'src/user/user.service';
import { ForbiddenError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { CatagoryInput } from './dto/catagory.input';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    private userService: UserService,
  ) {}

  async create(
    createItemInput: CreateItemInput,
    jwtDecodeReturnDto: JwtDecodeReturnDto,
    files: Promise<FileUpload>[],
  ) {
    let images = [];

    (await files).map(async (file) => {
      const { filename, createReadStream } = await file;
      const prefixName = jwtDecodeReturnDto.id + filename;
      const out = createWriteStream(`./src/images/${prefixName}`);
      const steam = createReadStream();
      steam.pipe(out);
      images.push(`images/${prefixName}`);
    });

    (await files).map(async (file) => {
      const { filename, createReadStream } = await file;
    });

    const Item = new this.itemModel({
      ...createItemInput,
      seller: jwtDecodeReturnDto.id,
      images,
    });

    await Item.save();
    return Item;
  }

  async getItems() {
    const getItems = await this.itemModel.find().sort({ createdAt: -1 });

    return getItems;
  }

  async getItemsByCatagory(catagoryInput: CatagoryInput) {
    const getItems = await this.itemModel.aggregate([
      {
        $match: { catagory: { $in: catagoryInput.catagory } },
      },
    ]);
    return getItems;
  }

  async getItemById(id: string) {
    const getItem = await this.itemModel.findById(id).populate({
      path: 'seller',
      select: ['name', 'avatar', 'phone', 'location'],
    });

    return getItem;
  }

  async deleteItem(id: string, user: JwtDecodeReturnDto) {
    const Item = await this.itemModel.findById(id);
    if (Item) {
      if (Item.seller.toString() !== user.id) {
        throw new ForbiddenError('u must be seller of this item');
      }
      await Item.delete();
      return 'deleted';
    }
    throw new GraphQLError('Item not found');
  }

  async updateItem() {}
}
