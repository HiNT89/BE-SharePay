import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/common/base/base.service';
import { Paid } from './entities/paid.entity';
import { CreatePaidDto, UpdatePaidDto } from './dto/paid.dto';
import { PaginationDto, BaseResponseDto } from '@/common/base/base.common.dto';

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

  async findActivePaids(
    paginationDto?: PaginationDto,
  ): Promise<BaseResponseDto<Paid[]> | Paid[]> {
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
