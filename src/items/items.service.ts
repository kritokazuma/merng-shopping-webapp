import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { CreateItemInput } from './dto/create-item.input';
import { Item } from './items.schema';
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { FilterItemInput } from './dto/filter-item.input';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { UpdateItemInput } from './dto/update-item.input';
import { readFile, unlink } from 'fs';
import { SearchInput } from './dto/search.input';
import { User } from 'src/user/user.schema';
import { Comment } from 'src/comment/comment.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
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

  private async sellerPopulate(result) {
    return await this.userModel.populate(result, {
      path: 'seller',
      select: ['_id', 'name', 'avatar', 'phone', 'location'],
    });
  }

  /**
   * create new items
   * @Param CreateInput contains items data
   **/
  async create(
    createItemInput: CreateItemInput,
    user: JwtDecodeReturnDto,
    files: Promise<FileUpload>[],
  ) {
    try {
      const images = await this.saveImage(files, user.id);
      const Item = new this.itemModel({
        ...createItemInput,
        seller: user.id,
        images,
      });

      await Item.save();
      return await this.sellerPopulate(Item);
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  /**
   * Get All Item In Ascending
   * @param filterItemInput catagoty, limit and skip
   * @returns Items
   */
  async getItems(filterItemInput: FilterItemInput) {
    try {
      const getItems = await this.itemModel.aggregate([
        { $match: {} },
        { $limit: filterItemInput.limit },
        { $skip: filterItemInput.skip },
      ]);

      return await this.sellerPopulate(getItems);
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  /** Get Items By Catagory
   * @Param catagoryInput is for filtering catagory
   * @returns Items
   */
  async getItemsByCatagory(catagoryInput: FilterItemInput) {
    try {
      const getItems = await this.itemModel.aggregate([
        {
          $match: { catagory: { $in: catagoryInput.catagory } },
        },
        { $skip: catagoryInput.skip },
        { $limit: catagoryInput.limit },
      ]);

      return await this.sellerPopulate(getItems);
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  /**
   * return intems in random
   * @returns items in random
   */
  async getItemRandomly() {
    try {
      const items = await this.itemModel.aggregate([
        {
          $sample: { size: 20 },
        },
      ]);
      return await this.sellerPopulate(items);
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  /**
   * Get Single Item by Id
   * @param id User Id
   * @returns singleItem by Id
   */
  async getItemById(id: string) {
    const item = await this.itemModel
      .findById(id)
      .populate({
        path: 'seller',
        select: ['_id', 'name', 'avatar', 'phone', 'location'],
      })
      .catch((error) => {
        throw new ApolloError(error);
      });
    const comments = await this.commentModel
      .find({
        itemId: new Types.ObjectId(id),
      })
      .populate('userId', ['_id', 'name', 'avatar']);
    await this.commentModel.populate(comments, {
      path: 'reply',
      populate: {
        path: 'userId',
        select: ['_id', 'name', 'avatar'],
      },
    });
    item.comments = comments;
    return item;
  }

  /**
   * Delete Item By Seller
   * @param id id
   * @param user user details from jwt
   * @returns string "deleted"
   */
  async deleteItem(id: string, user: JwtDecodeReturnDto): Promise<string> {
    try {
      const Item = await this.itemModel.findById(id);
      if (Item) {
        if (Item.seller.toString() !== user.id) {
          throw new ForbiddenError('u must be seller of this item');
        }
        await Item.delete();
        return 'deleted';
      }
      throw new GraphQLError('Item not found');
    } catch (error) {
      throw new ApolloError(error);
    }
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
    try {
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
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  /**
   * Search item by text and range
   * @param searchInput input and price range
   * @returns Item
   */
  async getItemBySearch(searchInput: SearchInput) {
    try {
      if (searchInput.priceRange) {
        const item = await this.itemModel.aggregate([
          { $match: { $text: { $search: searchInput.input } } },
          { $match: { price: { $lte: searchInput.priceRange } } },
        ]);
        return await this.sellerPopulate(item);
      }
      const SearchWithtextInput = await this.itemModel.find({
        $text: { $search: searchInput.input },
      });
      return await this.sellerPopulate(SearchWithtextInput);
    } catch (error) {
      throw new ApolloError(error);
    }
  }
}
