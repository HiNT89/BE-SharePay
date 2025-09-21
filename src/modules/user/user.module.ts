import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Bill } from '../bill/entities/bill.entity';
import { Paid } from '../paid/entities/paid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bill, Paid])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
