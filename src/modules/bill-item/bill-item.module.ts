import { Module } from '@nestjs/common';
import { BillItemController } from './bill-item.controller';
import { BillItemService } from './bill-item.service';

@Module({
  controllers: [BillItemController],
  providers: [BillItemService]
})
export class BillItemModule {}
