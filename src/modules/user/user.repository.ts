import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BaseAbstractRepository, BaseInterfaceRepository } from '@/common';

export class UserRepository
  extends BaseAbstractRepository<UserEntity>
  implements BaseInterfaceRepository<UserEntity>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
