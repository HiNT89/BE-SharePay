import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentEntity } from './entities/payment.entity';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentResponseDto,
} from './dto/payment.dto';
import { PaymentRepository } from './payment.repository';
import { BaseResponseDto, RESPONSE_MESSAGES, ResponseCode } from '@/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(
    createDto: CreatePaymentDto,
  ): Promise<BaseResponseDto<PaymentResponseDto>> {
    const paymentData = {
      ...createDto,
      paid_at: createDto.paid_at ? new Date(createDto.paid_at) : new Date(),
    };

    const payment = await this.paymentRepository.save(paymentData);
    return BaseResponseDto.success(
      plainToInstance(PaymentResponseDto, payment),
      RESPONSE_MESSAGES.CREATED_SUCCESS,
      ResponseCode.CREATED,
    );
  }

  async update(
    id: number,
    updateDto: UpdatePaymentDto,
  ): Promise<BaseResponseDto<PaymentResponseDto>> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Không tìm thấy payment');
    }

    Object.assign(payment, updateDto);
    if (updateDto.paid_at) {
      payment.paid_at = new Date(updateDto.paid_at);
    }

    const updated = await this.paymentRepository.save(payment);
    return BaseResponseDto.success(
      plainToInstance(PaymentResponseDto, updated),
      RESPONSE_MESSAGES.UPDATED_SUCCESS,
    );
  }

  async findByBillId(
    billId: number,
  ): Promise<BaseResponseDto<PaymentResponseDto[]>> {
    const payments = await this.paymentRepository.findByBillId(billId);
    return BaseResponseDto.success(
      plainToInstance(PaymentResponseDto, payments),
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  async findByPayerIdAndBillId(
    payerId: number,
    billId: number,
  ): Promise<BaseResponseDto<PaymentResponseDto[]>> {
    const payments = await this.paymentRepository.findByPayerIdAndBillId(
      payerId,
      billId,
    );
    return BaseResponseDto.success(
      plainToInstance(PaymentResponseDto, payments),
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  async getTotalPaidByUserAndBill(
    payerId: number,
    billId: number,
  ): Promise<number> {
    return this.paymentRepository.getTotalPaidByUserAndBill(payerId, billId);
  }

  async getTotalPaidByBill(billId: number): Promise<number> {
    return this.paymentRepository.getTotalPaidByBill(billId);
  }

  async getPaymentStatsByMethod(billId: number): Promise<any[]> {
    return this.paymentRepository.getPaymentStatsByMethod(billId);
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Không tìm thấy payment');
    }

    await this.paymentRepository.deleteById(id);
    return BaseResponseDto.success(
      undefined,
      RESPONSE_MESSAGES.DELETED_SUCCESS,
    );
  }
}
