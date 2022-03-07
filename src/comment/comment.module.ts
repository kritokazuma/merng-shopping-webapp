import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentResolver } from './comment.resolver';
import { Comment, CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  providers: [CommentResolver, CommentService],
  exports: [MongooseModule],
})
export class CommentModule {}
