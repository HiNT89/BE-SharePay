import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/common/base/base.service';
import { Paid } from './entities/paid.entity';
import { CreatePaidDto, PaidResponseDto, UpdatePaidDto } from './dto/paid.dto';
import { PaginationDto, BaseResponseDto } from '@/common/base/base.common.dto';
import { RESPONSE_MESSAGES } from '@/common/config/response.config';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaidService extends BaseService<Paid> {
  constructor(
    @InjectRepository(Paid)
    private readonly userRepository: Repository<Paid>,
  ) {
    super(userRepository);
  }

  async createPaid(createPaidDto: CreatePaidDto): Promise<Paid> {
    return await this.create(createPaidDto);
  }

  async updatePaid(
    id: number,
    updatePaidDto: UpdatePaidDto,
  ): Promise<Paid | null> {
    // Check if user exists
    const existingPaid = await this.findOne(id);
    if (!existingPaid) {
      throw new NotFoundException('Paid not found');
    }

    return await this.update(id, updatePaidDto);
  }

  async findAllPaids(
    paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<PaidResponseDto[]>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
      search,
    } = paginationDto;
    const skip = (page - 1) * limit;
    const queryOptions: any = {
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
      where: { isActive: true },
      relations: ['user'], // Include user relation
    };

    if (search) {
      queryOptions.where = this.buildSearchQuery(search);
    }

    const [data, total] = await this.userRepository.findAndCount(queryOptions);

    // Transform entities to DTOs
    const transformedData = plainToInstance(PaidResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.paginated(
      transformedData,
      paginationDto,
      total,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  // Method để lấy bills với DTO response
  async findAllPaid(
    paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<PaidResponseDto[]>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
      search,
    } = paginationDto;
    const skip = (page - 1) * limit;

    const queryOptions: any = {
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
      where: { isActive: true },
      relations: ['user'], // Include user relation
    };

    if (search) {
      queryOptions.where = this.buildSearchQuery(search);
    }

    const [data, total] = await this.userRepository.findAndCount(queryOptions);

    // Transform entities to DTOs
    const transformedData = plainToInstance(PaidResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.paginated(
      transformedData,
      paginationDto,
      total,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }
}
