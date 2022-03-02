import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from 'src/items/items.module';
import { CommentResolver } from './comment.resolver';
import { Comment, CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    ItemsModule,
  ],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
