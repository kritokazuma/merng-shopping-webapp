import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';
import { Item } from 'src/items/items.schema';
import { CreateCommentInput } from './dto/create-comment.input';
import { Comment } from './comment.schema';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { UpdateCommentInput } from './dto/update-comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  /**
   * Create comment in comment collection
   * @param createCommentInput itemid, commentId?, comment
   * @param user user
   * @returns string
   */
  async createComment(
    createCommentInput: CreateCommentInput,
    user: JwtDecodeReturnDto,
  ): Promise<string> {
    try {
      const item = await this.itemModel.findById(createCommentInput.itemId);
      if (!item) throw new UserInputError('item Not Found');

      //Create new comment collection
      const comment = new this.commentModel({
        userId: user.id,
        itemId: item._id,
        comment: createCommentInput.comment,
      });

      await comment.save();
      return 'success';
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  /**
   * delete comment from collection
   * @param commentId comment id
   * @param user user
   * @return string
   */
  async deleteComment(
    commentId: string,
    user: JwtDecodeReturnDto,
  ): Promise<string> {
    try {
      const comment = await this.commentModel.findById(commentId);

      if (!comment) throw new UserInputError('comment not found');

      if (comment.userId.toString() !== user.id)
        throw new UserInputError('you are not owner of comment');

      await comment.delete();
      return 'deleted';
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  /**
   * Update comment by user
   * @param updateCommentInput commentId, comment
   * @param user user
   * @returns string
   */
  async updateComment(
    updateCommentInput: UpdateCommentInput,
    user: JwtDecodeReturnDto,
  ) {
    try {
      const comment = await this.commentModel.findById(
        updateCommentInput.commentId,
      );
      if (!comment) throw new UserInputError('comment not found');

      if (comment.userId.toString() !== user.id)
        throw new UserInputError('you are not owner of comment');

      comment.comment = updateCommentInput.comment;
      await comment.save();
      return 'updated';
    } catch (err) {
      throw new ApolloError(err);
    }
  }
}
