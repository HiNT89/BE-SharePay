import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { Bill } from './entities/bill.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, User])],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService, TypeOrmModule],
})
export class BillModule {}
