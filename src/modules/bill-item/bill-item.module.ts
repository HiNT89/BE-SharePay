import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillItemController } from './bill-item.controller';
import { BillItemService } from './bill-item.service';
import { BillItem } from './entities/bill-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillItem])],
  controllers: [BillItemController],
  providers: [BillItemService],
  exports: [BillItemService, TypeOrmModule],
})
export class BillItemModule {}
