import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { BillEntity } from './entities/bill.entity';
import { BillItemEntity } from './entities/bill-item.entity';
import { BillItemPayerEntity } from './entities/bill-item-payer.entity';
import { PaymentEntity } from './entities/payment.entity';

// Controllers
import { BillController } from './bill.controller';
import { BillItemController } from './bill-item.controller';
import { PaymentController } from './payment.controller';
import { BillCalculationController } from './bill-calculation.controller';

// Services
import { BillService } from './bill.service';
import { BillItemService } from './bill-item.service';
import { BillItemPayerService } from './bill-item-payer.service';
import { PaymentService } from './payment.service';
import { BillCalculationService } from './bill-calculation.service';

// Repositories
import { BillRepository } from './bill.repository';
import { BillItemRepository } from './bill-item.repository';
import { BillItemPayerRepository } from './bill-item-payer.repository';
import { PaymentRepository } from './payment.repository';

// Import BillUserModule for dependencies
import { BillUserModule } from '../bill-user/bill-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BillEntity,
      BillItemEntity,
      BillItemPayerEntity,
      PaymentEntity,
    ]),
    BillUserModule, // Import để sử dụng BillUserRepository trong BillCalculationService
  ],
  controllers: [
    BillController,
    BillItemController,
    PaymentController,
    BillCalculationController,
  ],
  providers: [
    BillService,
    BillItemService,
    BillItemPayerService,
    PaymentService,
    BillCalculationService,
    BillRepository,
    BillItemRepository,
    BillItemPayerRepository,
    PaymentRepository,
  ],
  exports: [
    BillService,
    BillItemService,
    BillItemPayerService,
    PaymentService,
    BillCalculationService,
    BillRepository,
    BillItemRepository,
    BillItemPayerRepository,
    PaymentRepository,
    TypeOrmModule,
  ],
})
export class BillModule {}
