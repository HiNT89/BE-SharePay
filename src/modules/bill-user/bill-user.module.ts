import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillUserController } from './bill-user.controller';
import { BillUserService } from './bill-user.service';
import { BillUserRepository } from './bill-user.repository';
import { BillUserEntity } from './entities/bill-user.entity';
import { BillModule } from '../bill/bill.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BillUserEntity]), BillModule, UserModule],
  controllers: [BillUserController],
  providers: [BillUserService, BillUserRepository],
  exports: [BillUserService, BillUserRepository, TypeOrmModule],
})
export class BillUserModule {}
