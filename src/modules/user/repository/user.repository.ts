import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { BaseAbstractRepository } from '@/common/repository/base.abstract.repository';
import { BaseInterfaceRepository } from '@/common/repository/base.interface';

interface RepositoryInterface extends BaseInterfaceRepository<User> {}

export class UserRepository
  extends BaseAbstractRepository<User>
  implements RepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super(repository);
  }
}
