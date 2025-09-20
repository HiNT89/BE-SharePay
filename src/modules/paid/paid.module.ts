import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaidController } from './paid.controller';
import { PaidService } from './paid.service';
import { Paid } from './entities/paid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paid])],
  controllers: [PaidController],
  providers: [PaidService],
  exports: [PaidService, TypeOrmModule],
})
export class PaidModule {}
