import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { Item, ItemSchema } from './items.schema';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import * as mongooseDelete from 'mongoose-delete';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  providers: [ItemsService, ItemsResolver],
})
export class ItemsModule {}
