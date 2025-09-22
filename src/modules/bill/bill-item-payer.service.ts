import { Injectable, NotFoundException } from '@nestjs/common';
import { BillItemPayerEntity } from './entities/bill-item-payer.entity';
import {
  CreateBillItemPayerDto,
  UpdateBillItemPayerDto,
  BillItemPayerResponseDto,
} from './dto/bill-item-payer.dto';
import { BillItemPayerRepository } from './bill-item-payer.repository';
import { BaseResponseDto, RESPONSE_MESSAGES, ResponseCode } from '@/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BillItemPayerService {
  constructor(
    private readonly billItemPayerRepository: BillItemPayerRepository,
  ) {}

  async create(
    createDto: CreateBillItemPayerDto,
  ): Promise<BaseResponseDto<BillItemPayerResponseDto>> {
    const billItemPayer = await this.billItemPayerRepository.save(createDto);
    return BaseResponseDto.success(
      plainToInstance(BillItemPayerResponseDto, billItemPayer),
      RESPONSE_MESSAGES.CREATED_SUCCESS,
      ResponseCode.CREATED,
    );
  }

  async update(
    id: number,
    updateDto: UpdateBillItemPayerDto,
  ): Promise<BaseResponseDto<BillItemPayerResponseDto>> {
    const billItemPayer = await this.billItemPayerRepository.findOne({
      where: { id },
    });
    if (!billItemPayer) {
      throw new NotFoundException('Không tìm thấy bill item payer');
    }

    Object.assign(billItemPayer, updateDto);
    const updated = await this.billItemPayerRepository.save(billItemPayer);

    return BaseResponseDto.success(
      plainToInstance(BillItemPayerResponseDto, updated),
      RESPONSE_MESSAGES.UPDATED_SUCCESS,
    );
  }

  async findByBillItemId(
    billItemId: number,
  ): Promise<BaseResponseDto<BillItemPayerResponseDto[]>> {
    const payers =
      await this.billItemPayerRepository.findByBillItemId(billItemId);
    return BaseResponseDto.success(
      plainToInstance(BillItemPayerResponseDto, payers),
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  async getTotalPrepaidByUserAndBill(
    payerId: number,
    billId: number,
  ): Promise<number> {
    return this.billItemPayerRepository.getTotalPrepaidByUserAndBill(
      payerId,
      billId,
    );
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    const billItemPayer = await this.billItemPayerRepository.findOne({
      where: { id },
    });
    if (!billItemPayer) {
      throw new NotFoundException('Không tìm thấy bill item payer');
    }

    await this.billItemPayerRepository.deleteById(id);
    return BaseResponseDto.success(
      undefined,
      RESPONSE_MESSAGES.DELETED_SUCCESS,
    );
  }
}
