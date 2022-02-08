import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerResolver } from './buyer.resolver';
import { ItemsModule } from 'src/items/items.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [ItemsModule, CartModule],
  providers: [BuyerResolver, BuyerService],
})
export class BuyerModule {}
