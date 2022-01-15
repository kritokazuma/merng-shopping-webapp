import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentSchema, Comment } from './commets.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Comment.name, schema: CommentSchema }],
      'items',
    ),
  ],
  providers: [CommentsService],
})
export class CommentsModule {}
