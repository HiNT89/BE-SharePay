import { Module } from '@nestjs/common';
import { PaidController } from './paid.controller';
import { PaidService } from './paid.service';

@Module({
  controllers: [PaidController],
  providers: [PaidService]
})
export class PaidModule {}
