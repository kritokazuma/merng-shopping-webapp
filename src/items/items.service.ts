import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { CreateItemInput } from './dto/create-item.input';
import { Item } from './items.schema';
import { UserService } from 'src/user/user.service';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { FilterItemInput } from './dto/filter-item.input';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { UpdateItemInput } from './dto/update-item.input';
import { readFile, unlink } from 'fs';
import { SearchInput } from './dto/search.input';

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
   * create new items
   * @Param CreateInput contains items data
   **/
  async create(
    createItemInput: CreateItemInput,
    user: JwtDecodeReturnDto,
    files: Promise<FileUpload>[],
  ): Promise<Item> {
    const images = [];

    if (files.length > 0) {
      const prefixName = await this.saveImage(files, user.id);
      images.push(...prefixName);
    }

    const Item = new this.itemModel({
      ...createItemInput,
      seller: user.id,
      images,
    });

    await Item.save();
    return Item;
  }

  /**
   * Get All Item In Ascending
   * @param filterItemInput catagoty, limit and skip
   * @returns Items
   */
  async getItems(filterItemInput: FilterItemInput): Promise<Item[]> {
    const getItems = await this.itemModel.aggregate([
      { $match: {} },
      { $limit: filterItemInput.limit },
      { $skip: filterItemInput.skip },
    ]);

    return getItems;
  }

  /** Get Items By Catagory
   * @Param catagoryInput is for filtering catagory
   * @returns Items
   */
  async getItemsByCatagory(catagoryInput: FilterItemInput): Promise<Item[]> {
    const getItems = await this.itemModel.aggregate([
      {
        $match: { catagory: { $in: catagoryInput.catagory } },
      },
      { $skip: catagoryInput.skip },
      { $limit: catagoryInput.limit },
    ]);
    return getItems;
  }

  /**
   * return intems in random
   * @returns items in random
   */
  async getItemRandomly(): Promise<Item[]> {
    return await this.itemModel.aggregate([
      {
        $sample: { size: 20 },
      },
    ]);
  }

  /**
   * Get Single Item by Id
   * @param id User Id
   * @returns singleItem by Id
   */
  async getItemById(id: string) {
    const getItem = await this.itemModel.findById(id).populate({
      path: 'seller',
      select: ['_id', 'name', 'avatar', 'phone', 'location'],
    });

    return getItem;
  }

  /**
   * Delete Item By Seller
   * @param id id
   * @param user user details from jwt
   * @returns string "deleted"
   */
  async deleteItem(id: string, user: JwtDecodeReturnDto): Promise<string> {
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

  /**
   * update items
   * @param updateItemInput inputs for update
   * @param files file upload
   * @param user jwtDecode
   * @returns Item[]
   */
  async updateItem(
    updateItemInput: UpdateItemInput,
    files: Promise<FileUpload>[],
    user: JwtDecodeReturnDto,
  ): Promise<Item> {
    const item = await this.getItemById(updateItemInput.id);
    if (!item) throw new GraphQLError('item not found');

    // prefix array for input check
    const prefixArray = ['description', 'label', 'price', 'quantity'];

    //update item
    const updateCbFn = (val) => (item[val] = updateItemInput[val]);
    prefixArray.map((val) => {
      updateItemInput[val] && updateCbFn(val);
    });

    //if user removed image
    if (updateItemInput.removedImage) {
      /*if delete images not equal or grater than total image
       update image */
      if (
        updateItemInput.removedImage.length < item.images.length ||
        (updateItemInput.removedImage.length >= item.images.length &&
          files?.length > 0)
      ) {
        //length of original array of images
        const imagesArrayLength = item.images.length;

        updateItemInput.removedImage.forEach(async (index) => {
          const imageName = item.images[index];

          //remove image from server
          this.removeImage(imageName);

          //get difference to add into later splice
          const checkDifference: number =
            imagesArrayLength - item.images.length;
          item.images.splice(index - checkDifference, 1);
        });
      } else {
        throw new GraphQLError('Item must have at least one image');
      }
    }

    if (files && files.length > 0) {
      const prefixNameArray = await this.saveImage(files, user.id);
      item.images.push(...prefixNameArray);
    }

    //update date
    item.updatedAt = new Date().toISOString();

    await item.save();
    return item.populate({
      path: 'seller',
      select: ['name', 'avatar', 'phone', 'location'],
    });
  }

  /**
   * Search item by text and range
   * @param searchInput input and price range
   * @returns Item
   */
  async getItemBySearch(searchInput: SearchInput): Promise<Item[]> {
    if (searchInput.priceRange) {
      return await this.itemModel.aggregate([
        { $match: { $text: { $search: searchInput.input } } },
        { $match: { price: { $lt: searchInput.priceRange } } },
      ]);
    }
    return await this.itemModel.find({ $text: { $search: searchInput.input } });
  }
}
