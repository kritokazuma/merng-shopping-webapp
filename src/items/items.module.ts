import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { Item, ItemSchema } from './items.schema';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Item.name, schema: ItemSchema }],
      'items',
    ),
    UserModule,
  ],
  providers: [ItemsService, ItemsResolver],
})
export class ItemsModule {}
