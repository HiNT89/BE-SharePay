import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/common/base/base.service';
import { Bill } from './entities/bill.entity';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';
import { PaginationDto, BaseResponseDto } from '@/common/base/base.common.dto';

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

  async findActiveBills(
    paginationDto?: PaginationDto,
  ): Promise<BaseResponseDto<Bill[]> | Bill[]> {
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
