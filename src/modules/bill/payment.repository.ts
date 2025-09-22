import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { BaseAbstractRepository, BaseInterfaceRepository } from '@/common';

export class PaymentRepository
  extends BaseAbstractRepository<PaymentEntity>
  implements BaseInterfaceRepository<PaymentEntity>
{
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {
    super(paymentRepository);
  }

  /**
   * Tìm tất cả payments của một bill
   */
  async findByBillId(billId: number): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({
      where: { billId },
      relations: ['payer'],
      order: { paid_at: 'DESC' },
    });
  }

  /**
   * Tìm tất cả payments của một user trong một bill
   */
  async findByPayerIdAndBillId(
    payerId: number,
    billId: number,
  ): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({
      where: { payerId, billId },
      order: { paid_at: 'DESC' },
    });
  }

  /**
   * Tính tổng tiền đã thanh toán của một user trong một bill
   */
  async getTotalPaidByUserAndBill(
    payerId: number,
    billId: number,
  ): Promise<number> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.payerId = :payerId', { payerId })
      .andWhere('payment.billId = :billId', { billId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  /**
   * Tính tổng tiền đã thanh toán cho một bill
   */
  async getTotalPaidByBill(billId: number): Promise<number> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.billId = :billId', { billId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  /**
   * Lấy thống kê thanh toán theo phương thức
   */
  async getPaymentStatsByMethod(billId: number): Promise<any[]> {
    return this.paymentRepository
      .createQueryBuilder('payment')
      .select([
        'payment.method as method',
        'COUNT(payment.id) as count',
        'SUM(payment.amount) as total_amount',
      ])
      .where('payment.billId = :billId', { billId })
      .groupBy('payment.method')
      .getRawMany();
  }

  /**
   * Xóa payment
   */
  async deleteById(id: number): Promise<void> {
    await this.paymentRepository.delete(id);
  }
}
