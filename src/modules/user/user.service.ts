import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseService } from '@/common/base/base.service';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PaginationDto, BaseResponseDto } from '@/common/base/base.common.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // Override search functionality for User entity
  protected buildSearchQuery(
    search: string,
  ): FindOptionsWhere<User> | FindOptionsWhere<User>[] {
    return [{ email: ILike(`%${search}%`) }, { name: ILike(`%${search}%`) }];
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    return await this.create(createUserDto);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Check if user exists
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (userWithEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return await this.update(id, updateUserDto);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findActiveUsers(
    paginationDto?: PaginationDto,
  ): Promise<BaseResponseDto<User[]> | User[]> {
    if (paginationDto) {
      return await this.findByWithPagination(
        { where: { isActive: true } },
        paginationDto,
      );
    }

    return await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });
  }
}
