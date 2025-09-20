import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/common/base/base.service';
import { BillItem } from './entities/bill-item.entity';
import { CreateBillItemDto, UpdateBillItemDto } from './dto/bill-item.dto';
import { PaginationDto, BaseResponseDto } from '@/common/base/base.common.dto';

@Injectable()
export class BillItemService extends BaseService<BillItem> {
  constructor(
    @InjectRepository(BillItem)
    private readonly userRepository: Repository<BillItem>,
  ) {
    super(userRepository);
  }

  async createBillItem(
    createBillItemDto: CreateBillItemDto,
  ): Promise<BillItem> {
    return await this.create(createBillItemDto);
  }

  async updateBillItem(
    id: number,
    updateBillItemDto: UpdateBillItemDto,
  ): Promise<BillItem | null> {
    // Check if user exists
    const existingBillItem = await this.findOne(id);
    if (!existingBillItem) {
      throw new NotFoundException('BillItem not found');
    }

    return await this.update(id, updateBillItemDto);
  }

  async findActiveBillItems(
    paginationDto?: PaginationDto,
  ): Promise<BaseResponseDto<BillItem[]> | BillItem[]> {
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
