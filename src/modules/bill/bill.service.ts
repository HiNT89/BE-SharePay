import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { BillEntity } from './entities/bill.entity';
import { CreateBillDto, UpdateBillDto, BillResponseDto } from './dto/bill.dto';
import { BillRepository } from './bill.repository';
import { BaseResponseDto, PaginationDto, RESPONSE_MESSAGES } from '@/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BillService {
  constructor(private readonly repository: BillRepository) {}

  // Override search functionality for Bill entity
  protected buildSearchQuery(
    search: string,
  ): FindOptionsWhere<BillEntity> | FindOptionsWhere<BillEntity>[] {
    return [
      { title: ILike(`%${search}%`) },
      { note: ILike(`%${search}%`) },
      { currency_code: ILike(`%${search}%`) },
    ];
  }

  async getAllWithPagination(
    pageOptionsDto: PaginationDto,
  ): Promise<BaseResponseDto<BillResponseDto[]>> {
    return this.findFilterParam(pageOptionsDto);
  }

  async findFilterParam(
    pageOptionsDto: PaginationDto,
  ): Promise<BaseResponseDto<BillResponseDto[]>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = pageOptionsDto;

    try {
      console.log('findFilterParam called with:', pageOptionsDto);

      const queryBuilder = this.repository.createQueryBuilder('Bill');
      queryBuilder.where('Bill.isActive = :isActive', { isActive: true });

      // Apply sorting with validation
      const validSortFields = [
        'id',
        'title',
        'total_amount',
        'original_total_amount',
        'discount',
        'percent_discount',
        'currency_code',
        'createdAt',
        'updatedAt',
      ];
      const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'id';
      queryBuilder.orderBy(`Bill.${safeSortBy}`, sortOrder);

      // Apply pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      console.log('Query:', queryBuilder.getQuery());
      console.log('Parameters:', queryBuilder.getParameters());

      // Get results and total count
      const [data, total] = await queryBuilder.getManyAndCount();

      // Transform entities to DTOs
      const transformedData = plainToInstance(BillResponseDto, data, {
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

  async createBill(
    createBillDto: CreateBillDto,
  ): Promise<BaseResponseDto<BillResponseDto | null>> {
    const result = await this.repository.save(createBillDto);
    let typeResponse = 'error';
    let messageResponse: string = RESPONSE_MESSAGES.INTERNAL_ERROR;

    let data: BillResponseDto | null = null;

    if (result) {
      typeResponse = 'success';
      messageResponse = RESPONSE_MESSAGES.CREATED_SUCCESS;
      const transformedData = plainToInstance(BillResponseDto, createBillDto, {
        excludeExtraneousValues: true,
      });
      data = transformedData;
      console.log('🚀 ~ BillService ~ createBill ~ data:', {
        data,
        transformedData,
        createBillDto,
      });
    }

    return BaseResponseDto[typeResponse](data, messageResponse);
  }

  async updateBill(
    id: number,
    updateBillDto: UpdateBillDto,
  ): Promise<BaseResponseDto<BillResponseDto | null>> {
    // Check if Bill exists
    const existingBill = await this.repository.findOne({
      where: { id, isActive: true },
    });
    console.log('🚀 ~ BillService ~ updateBill ~ existingBill:', existingBill);
    if (!existingBill) {
      throw new NotFoundException('Bill not found');
    }

    // Merge the update data with the existing Bill and save
    const updatedBill = { ...existingBill, ...updateBillDto };
    const result = await this.repository.save(updatedBill);

    let typeResponse = 'success';
    let messageResponse: string = RESPONSE_MESSAGES.UPDATED_SUCCESS;

    let data: BillResponseDto | null = null;

    if (!result) {
      typeResponse = 'error';
      messageResponse = RESPONSE_MESSAGES.INTERNAL_ERROR;
    } else {
      const transformedData = plainToInstance(BillResponseDto, result, {
        excludeExtraneousValues: true,
      });
      data = transformedData;
    }

    return BaseResponseDto[typeResponse](data, messageResponse);
  }

  async findById(id: number): Promise<BillEntity | null> {
    return await this.repository.findOne({
      where: { id, isActive: true },
    });
  }

  async delete(id: number): Promise<BaseResponseDto<boolean>> {
    const existingBill = await this.repository.findOne({
      where: { id, isActive: true },
    });
    if (!existingBill) {
      throw new NotFoundException('Bill not found');
    }
    const updatedBill = { ...existingBill, isActive: false };

    const result = await this.repository.save(updatedBill);

    let typeResponse = 'success';
    let messageResponse: string = RESPONSE_MESSAGES.UPDATED_SUCCESS;

    let data: boolean = true;

    if (!result) {
      typeResponse = 'error';
      messageResponse = RESPONSE_MESSAGES.INTERNAL_ERROR;
      data = false;
    }

    return BaseResponseDto[typeResponse](data, messageResponse);
  }
}
