import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaidController } from './paid.controller';
import { PaidService } from './paid.service';
import { Paid } from './entities/paid.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paid, User])],
  controllers: [PaidController],
  providers: [PaidService],
  exports: [PaidService, TypeOrmModule],
})
export class PaidModule {}
