import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerResolver } from './seller.resolver';
import { ItemsModule } from 'src/items/items.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [ItemsModule, OrderModule],
  providers: [SellerResolver, SellerService],
})
export class SellerModule {}
