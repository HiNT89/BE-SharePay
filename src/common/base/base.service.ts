import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  ILike,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { PaginationDto, BaseResponseDto } from './base.common.dto';
import { RESPONSE_MESSAGES } from '../config/response.config';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findAll(paginationDto: PaginationDto): Promise<BaseResponseDto<T[]>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
      search,
    } = paginationDto;
    const skip = (page - 1) * limit;

    const queryOptions: FindManyOptions<T> = {
      skip,
      take: limit,
      order: { [sortBy]: sortOrder } as any,
      where: { isActive: true } as FindOptionsWhere<T>,
    };

    // Add search functionality if search term is provided
    if (search) {
      // You can customize this based on your entity fields
      queryOptions.where = this.buildSearchQuery(search);
    }

    const [data, total] = await this.repository.findAndCount(queryOptions);

    return BaseResponseDto.paginated(
      data,
      paginationDto,
      total,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  // Override this method in child services to customize search functionality
  protected buildSearchQuery(
    search: string,
  ): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
    // Default implementation - override in child services
    return {} as FindOptionsWhere<T>;
  }

  async findOne(id: number): Promise<T | null> {
    return await this.repository.findOne({
      where: { id, isActive: true } as FindOptionsWhere<T>,
    });
  }

  async findBy(options: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find({
      ...options,
      where: { ...options.where, isActive: true } as FindOptionsWhere<T>,
    });
  }

  async findByWithPagination(
    options: FindManyOptions<T>,
    paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<T[]>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const queryOptions: FindManyOptions<T> = {
      ...options,
      skip,
      take: limit,
      order: { ...options.order, [sortBy]: sortOrder } as any,
      where: { ...options.where, isActive: true } as FindOptionsWhere<T>,
    };

    const [data, total] = await this.repository.findAndCount(queryOptions);

    return BaseResponseDto.paginated(
      data,
      paginationDto,
      total,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  async update(id: number, updateDto: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, updateDto as any);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.update(id, { isActive: false } as any);
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return await this.repository.count(options);
  }

  async exists(id: number): Promise<boolean> {
    const entity = await this.findOne(id);
    return !!entity;
  }
}
