import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BillEntity } from './entities/bill.entity';
import { BaseAbstractRepository, BaseInterfaceRepository } from '@/common';

export class BillRepository
  extends BaseAbstractRepository<BillEntity>
  implements BaseInterfaceRepository<BillEntity>
{
  constructor(
    @InjectRepository(BillEntity)
    private readonly BillRepository: Repository<BillEntity>,
  ) {
    super(BillRepository);
  }
}
