import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { Item, ItemSchema } from './items.schema';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { OrderModule } from 'src/order/order.module';
import { CommentModule } from 'src/comment/comment.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    UserModule,
    OrderModule,
    CommentModule,
  ],
  providers: [ItemsService, ItemsResolver],
  exports: [MongooseModule, ItemsService],
})
export class ItemsModule {}
