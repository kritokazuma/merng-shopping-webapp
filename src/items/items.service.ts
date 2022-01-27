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
import { UpdateItemInput } from './dto/update-item.input';
import { readFile, unlink } from 'fs';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    private userService: UserService,
  ) {}

  private removeImage(prefixName): void {
    const filePath = `/src/images/${prefixName}`;
    readFile(filePath, (err, data) => {
      if (data) {
        unlink(filePath, (error) => {
          if (error) throw new GraphQLError(error.message);
        });
      }
    });
  }

  private async saveImage(files: Promise<FileUpload>[], id): Promise<string[]> {
    const images = [];
    (await files).map(async (file) => {
      const { filename, createReadStream } = await file;
      const prefixName = id + filename;
      const out = createWriteStream(`./src/images/${prefixName}`);
      const steam = createReadStream();
      steam.pipe(out);
      images.push(`images/${prefixName}`);
    });
    return images;
  }

  /**
   * @Param CreateInput contains items data
   **/
  async create(
    createItemInput: CreateItemInput,
    user: JwtDecodeReturnDto,
    files: Promise<FileUpload>[],
  ) {
    let images = [];

    if (files.length > 0) {
      const prefixName = await this.saveImage(files, user.id);
      images.push(...prefixName);
    }

    (await files).map(async (file) => {
      const { filename, createReadStream } = await file;
    });

    const Item = new this.itemModel({
      ...createItemInput,
      seller: user.id,
      images,
    });

    await Item.save();
    return Item;
  }

  /* Get All Items in ascending */
  async getItems() {
    const getItems = await this.itemModel.find().sort({ createdAt: -1 });

    return getItems;
  }

  /** Get Items By Catagoty
   * @Param catagoryInput is for filtering catagory
   */
  async getItemsByCatagory(catagoryInput: CatagoryInput) {
    const getItems = await this.itemModel.aggregate([
      {
        $match: { catagory: { $in: catagoryInput.catagory } },
      },
    ]);
    return getItems;
  }

  /**
   *
   * @param id User Id
   * @returns singleItem by Id
   */
  async getItemById(id: string) {
    const getItem = await this.itemModel.findById(id).populate({
      path: 'seller',
      select: ['name', 'avatar', 'phone', 'location'],
    });

    return getItem;
  }

  /**
   *
   * @param id id
   * @param user user details from jwt
   * @returns string "deleted"
   */
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

  async updateItem(
    updateItemInput: UpdateItemInput,
    files: Promise<FileUpload>[],
    user: JwtDecodeReturnDto,
  ) {
    const item = await this.itemModel.findById(updateItemInput.id);
    if (!item) throw new GraphQLError('item not found');

    // prefix array for input check
    const prefixArray = ['description', 'label', 'price', 'quantity'];

    //update item
    const updateCbFn = (val) => (item[val] = updateItemInput[val]);
    prefixArray.map((val) => {
      updateItemInput[val] && updateCbFn(val);
    });

    if (updateItemInput.removedImage) {
      const imagesArrayLength = item.images.length;
      updateItemInput.removedImage.map(async (index) => {
        const imageName = item.images[index];
        this.removeImage(imageName);
        const checkLength: boolean = item.images.length < imagesArrayLength;
        const decreaseNum: number = checkLength ? 1 : 0;
        item.images.splice(index - decreaseNum, 1);
      });
    }

    if (files && files.length > 0) {
      const prefixNameArray = await this.saveImage(files, user.id);
      item.images.push(...prefixNameArray);
    }

    await item.save();
    return item.populate({
      path: 'seller',
      select: ['name', 'avatar', 'phone', 'location'],
    });
  }
}
