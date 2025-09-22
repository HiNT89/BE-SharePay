import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike, Brackets } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { BaseResponseDto, PaginationDto, RESPONSE_MESSAGES } from '@/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  // Override search functionality for User entity
  protected buildSearchQuery(
    search: string,
  ): FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[] {
    return [{ email: ILike(`%${search}%`) }, { name: ILike(`%${search}%`) }];
  }

  async getAllWithPagination(
    pageOptionsDto: PaginationDto,
  ): Promise<BaseResponseDto<UserResponseDto[]>> {
    return this.findFilterParam(pageOptionsDto);
  }

  async findFilterParam(
    pageOptionsDto: PaginationDto,
  ): Promise<BaseResponseDto<UserResponseDto[]>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = pageOptionsDto;

    try {
      console.log('findFilterParam called with:', pageOptionsDto);

      const queryBuilder = this.repository.createQueryBuilder('user');
      queryBuilder.where('user.isActive = :isActive', { isActive: true });

      // Apply sorting with validation
      const validSortFields = [
        'id',
        'email',
        'name',
        'role',
        'createdAt',
        'updatedAt',
      ];
      const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'id';
      queryBuilder.orderBy(`user.${safeSortBy}`, sortOrder);

      // Apply pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      console.log('Query:', queryBuilder.getQuery());
      console.log('Parameters:', queryBuilder.getParameters());

      // Get results and total count
      const [data, total] = await queryBuilder.getManyAndCount();

      // Transform entities to DTOs
      const transformedData = plainToInstance(UserResponseDto, data, {
        excludeExtraneousValues: true,
      });

      console.log('Transformed data:', transformedData[0]);

      return BaseResponseDto.paginated(
        transformedData,
        pageOptionsDto,
        total,
        RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
      );
    } catch (error) {
      console.error('Error in findFilterParam:', error);
      throw error;
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto | null>> {
    // Check if user already exists
    const existingUser = await this.repository.findOne({
      where: { email: createUserDto.email, isActive: true },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    const result = await this.repository.save(createUserDto);
    let typeResponse = 'success';
    let messageResponse: string = RESPONSE_MESSAGES.CREATED_SUCCESS;

    let data: UserResponseDto | null = null;

    if (!result) {
      typeResponse = 'error';
      messageResponse = RESPONSE_MESSAGES.INTERNAL_ERROR;
    } else {
      const transformedData = plainToInstance(UserResponseDto, result, {
        excludeExtraneousValues: true,
      });
      data = transformedData;
    }
    // Transform entities to DTOs

    return BaseResponseDto[typeResponse](data, messageResponse);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto | null>> {
    // Check if user exists
    const existingUser = await this.repository.findOne({
      where: { id, isActive: true },
    });
    console.log('🚀 ~ UserService ~ updateUser ~ existingUser:', existingUser);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.repository.findOne({
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

    // Merge the update data with the existing user and save
    const updatedUser = { ...existingUser, ...updateUserDto };
    const result = await this.repository.save(updatedUser);

    let typeResponse = 'success';
    let messageResponse: string = RESPONSE_MESSAGES.UPDATED_SUCCESS;

    let data: UserResponseDto | null = null;

    if (!result) {
      typeResponse = 'error';
      messageResponse = RESPONSE_MESSAGES.INTERNAL_ERROR;
    } else {
      const transformedData = plainToInstance(UserResponseDto, result, {
        excludeExtraneousValues: true,
      });
      data = transformedData;
    }
    // Transform entities to DTOs

    return BaseResponseDto[typeResponse](data, messageResponse);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOne({
      where: { email, isActive: true },
    });
  }

  async delete(id: number): Promise<BaseResponseDto<boolean>> {
    const existingUser = await this.repository.findOne({
      where: { id, isActive: true },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = { ...existingUser, isActive: false };

    const result = await this.repository.save(updatedUser);

    let typeResponse = 'success';
    let messageResponse: string = RESPONSE_MESSAGES.UPDATED_SUCCESS;

    let data: boolean = true;

    if (!result) {
      typeResponse = 'error';
      messageResponse = RESPONSE_MESSAGES.INTERNAL_ERROR;
      data = false;
    }
    // Transform entities to DTOs

    return BaseResponseDto[typeResponse](data, messageResponse);
  }
}
