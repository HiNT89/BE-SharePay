// Import decorator Module từ NestJS
import { Module } from '@nestjs/common';

// Import TypeOrmModule để đăng ký entity với database
import { TypeOrmModule } from '@nestjs/typeorm';

// Import các components của User module
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

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
    // Đăng ký User entity để có thể inject UserRepository
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController], // Controller để handle API endpoints
  providers: [UserService], // Service chứa business logic
  exports: [UserService], // Export UserService để AuthModule có thể sử dụng
})
export class UserModule {}
