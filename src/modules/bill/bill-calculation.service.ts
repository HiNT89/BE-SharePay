import { Injectable, NotFoundException } from '@nestjs/common';
import { BillUserEntity } from '../bill-user/entities/bill-user.entity';
import { BillUserRepository } from '../bill-user/bill-user.repository';
import { BillItemService } from './bill-item.service';
import { BillItemPayerService } from './bill-item-payer.service';
import { PaymentService } from './payment.service';
import { BaseResponseDto, RESPONSE_MESSAGES } from '@/common';

/**
 * Interface cho kết quả tính toán nghĩa vụ thanh toán
 */
export interface BillUserCalculation {
  userId: number;
  billId: number;
  share_ratio: number;
  due_amount: number; // Số tiền phải trả theo tỷ lệ
  prepaid_amount: number; // Số tiền đã ứng trước
  paid_amount: number; // Số tiền đã thanh toán
  net_amount: number; // Số dư cuối (due_amount - prepaid_amount - paid_amount)
  is_settled: boolean; // Đã đối soát xong chưa
}

@Injectable()
export class BillCalculationService {
  constructor(
    private readonly billUserRepository: BillUserRepository,
    private readonly billItemService: BillItemService,
    private readonly billItemPayerService: BillItemPayerService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Tính toán nghĩa vụ thanh toán cho tất cả users trong một bill
   */
  async calculateBillUserObligations(
    billId: number,
  ): Promise<BaseResponseDto<BillUserCalculation[]>> {
    // Lấy tất cả bill users
    const billUsers = await this.billUserRepository.find({ where: { billId } });

    // Tính tổng tiền của bill từ các items
    const totalBillAmount =
      await this.billItemService.getTotalAmountByBillId(billId);

    // Tính tổng share ratio
    const totalShareRatio = billUsers.reduce(
      (sum, user) => sum + user.share_ratio,
      0,
    );

    const calculations: BillUserCalculation[] = [];

    for (const billUser of billUsers) {
      // Tính due_amount theo tỷ lệ
      const due_amount =
        (billUser.share_ratio / totalShareRatio) * totalBillAmount;

      // Tính prepaid_amount (số tiền đã ứng trước)
      const prepaid_amount =
        await this.billItemPayerService.getTotalPrepaidByUserAndBill(
          billUser.userId,
          billId,
        );

      // Tính paid_amount (số tiền đã thanh toán)
      const paid_amount = await this.paymentService.getTotalPaidByUserAndBill(
        billUser.userId,
        billId,
      );

      // Tính net_amount (số dư cuối)
      const net_amount = due_amount - prepaid_amount - paid_amount;

      // Kiểm tra is_settled
      const is_settled = net_amount <= 0;

      calculations.push({
        userId: billUser.userId,
        billId: billUser.billId,
        share_ratio: billUser.share_ratio,
        due_amount,
        prepaid_amount,
        paid_amount,
        net_amount,
        is_settled,
      });
    }

    return BaseResponseDto.success(
      calculations,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  /**
   * Tính toán nghĩa vụ cho một user cụ thể trong bill
   */
  async calculateUserObligation(
    userId: number,
    billId: number,
  ): Promise<BaseResponseDto<BillUserCalculation>> {
    const calculations = await this.calculateBillUserObligations(billId);
    const userCalculation = calculations.data?.find(
      (calc) => calc.userId === userId,
    );

    if (!userCalculation) {
      throw new NotFoundException('Không tìm thấy user trong bill này');
    }

    return BaseResponseDto.success(
      userCalculation,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  /**
   * Cập nhật trạng thái settled cho bill user
   */
  async updateSettledStatus(
    userId: number,
    billId: number,
  ): Promise<BaseResponseDto<void>> {
    const billUser = await this.billUserRepository.findOne({
      where: { userId, billId },
    });

    if (!billUser) {
      throw new NotFoundException('Không tìm thấy bill user');
    }

    const calculation = await this.calculateUserObligation(userId, billId);
    const isSettled = calculation.data!.net_amount <= 0;

    billUser.is_settled = isSettled;
    if (isSettled) {
      billUser.settled_at = new Date();
    }

    await this.billUserRepository.save(billUser);

    return BaseResponseDto.success(
      undefined,
      RESPONSE_MESSAGES.UPDATED_SUCCESS,
    );
  }

  /**
   * Kiểm tra và cập nhật tất cả trạng thái settled trong bill
   */
  async updateAllSettledStatuses(
    billId: number,
  ): Promise<BaseResponseDto<void>> {
    const calculations = await this.calculateBillUserObligations(billId);

    for (const calc of calculations.data || []) {
      await this.updateSettledStatus(calc.userId, calc.billId);
    }

    return BaseResponseDto.success(
      undefined,
      'Cập nhật trạng thái settled thành công',
    );
  }
}
