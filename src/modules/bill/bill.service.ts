import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/common/base/base.service';
import { Bill } from './entities/bill.entity';
import { CreateBillDto, UpdateBillDto, BillResponseDto } from './dto/bill.dto';
import { PaginationDto, BaseResponseDto } from '@/common/base/base.common.dto';
import { RESPONSE_MESSAGES } from '@/common/config/response.config';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BillService extends BaseService<Bill> {
  constructor(
    @InjectRepository(Bill)
    private readonly userRepository: Repository<Bill>,
  ) {
    super(userRepository);
  }

  async createBill(createBillDto: CreateBillDto): Promise<Bill> {
    return await this.create(createBillDto);
  }

  async updateBill(
    id: number,
    updateBillDto: UpdateBillDto,
  ): Promise<Bill | null> {
    // Check if user exists
    const existingBill = await this.findOne(id);
    if (!existingBill) {
      throw new NotFoundException('Bill not found');
    }

    return await this.update(id, updateBillDto);
  }

  // Method để lấy bills với DTO response
  async findAllBills(
    paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<BillResponseDto[]>> {
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
      relations: [
        'user',
        'billItems',
        'billItems.paidList',
        'billItems.paidList.user',
      ], // Include nested relations
    };

    if (search) {
      queryOptions.where = this.buildSearchQuery(search);
    }

    const [data, total] = await this.userRepository.findAndCount(queryOptions);

    // Transform entities to DTOs
    const transformedData = plainToInstance(BillResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.paginated(
      transformedData,
      paginationDto,
      total,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  // Method để lấy single bill với DTO response
  async findOneBill(id: number): Promise<BillResponseDto | null> {
    const bill = await this.userRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'user',
        'billItems',
        'billItems.paidList',
        'billItems.paidList.user',
      ], // Include nested relations
    });

    if (!bill) return null;

    // Transform entity to DTO
    return plainToInstance(BillResponseDto, bill, {
      excludeExtraneousValues: true,
    });
  }

  // Override findAll để include user relation
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<Bill[]>> {
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
      relations: [
        'user',
        'billItems',
        'billItems.paidList',
        'billItems.paidList.user',
      ], // Include nested relations
    };

    if (search) {
      queryOptions.where = this.buildSearchQuery(search);
    }

    const [data, total] = await this.userRepository.findAndCount(queryOptions);

    return BaseResponseDto.paginated(
      data,
      paginationDto,
      total,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  // Override findOne để include user relation
  async findOne(id: number): Promise<Bill | null> {
    return await this.userRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'user',
        'billItems',
        'billItems.paidList',
        'billItems.paidList.user',
      ], // Include nested relations
    });
  }

  async findActiveBills(
    paginationDto?: PaginationDto,
  ): Promise<BaseResponseDto<Bill[]> | Bill[]> {
    if (paginationDto) {
      return await this.findByWithPagination(
        {
          where: { isActive: true },
          relations: [
            'user',
            'billItems',
            'billItems.paidList',
            'billItems.paidList.user',
          ], // Include nested relations
        },
        paginationDto,
      );
    }

    return await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
      relations: [
        'user',
        'billItems',
        'billItems.paidList',
        'billItems.paidList.user',
      ], // Include nested relations
    });
  }
}
