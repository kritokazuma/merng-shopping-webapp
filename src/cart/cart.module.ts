import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { ItemsModule } from 'src/items/items.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ItemsModule,
    UserModule,
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
