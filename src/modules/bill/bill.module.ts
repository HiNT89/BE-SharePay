// Import decorator Module từ NestJS
import { Module } from '@nestjs/common';

// Import TypeOrmModule để đăng ký entity với database
import { TypeOrmModule } from '@nestjs/typeorm';

// Import các components của User module
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { Bill } from './bill.entity';
import { User } from '@/modules/user/user.entity';

/**
 * User Module - Module quản lý người dùng
 *
 * Chức năng:
 * - Đăng ký User entity với TypeORM
 * - Cung cấp UserController để handle HTTP requests
 * - Cung cấp UserService để xử lý business logic
 * - Export UserService để các module khác có thể sử dụng (như AuthModule)
 */
@Module({
  imports: [
    // Đăng ký Bill entity để có thể inject BillRepository
    TypeOrmModule.forFeature([Bill, User]),
  ],
  controllers: [BillController], // Controller để handle API endpoints
  providers: [BillService], // Service chứa business logic
  exports: [BillService], // Export BillService để AuthModule có thể sử dụng
})
export class BillModule {}
