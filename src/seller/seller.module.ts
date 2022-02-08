import { Module, UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerResolver } from './seller.resolver';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [ItemsModule],
  providers: [SellerResolver, SellerService],
})
export class SellerModule {}
