import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BillUserEntity } from './entities/bill-user.entity';

@Injectable()
export class BillUserRepository extends Repository<BillUserEntity> {
  constructor(private dataSource: DataSource) {
    super(BillUserEntity, dataSource.createEntityManager());
  }

  /**
   * Tìm tất cả người dùng trong một hóa đơn
   */
  async findUsersByBillId(billId: number): Promise<BillUserEntity[]> {
    return this.find({
      where: { billId, isActive: true },
      relations: ['user'],
    });
  }

  /**
   * Tìm tất cả hóa đơn của một người dùng
   */
  async findBillsByUserId(userId: number): Promise<BillUserEntity[]> {
    return this.find({
      where: { userId, isActive: true },
      relations: ['bill'],
    });
  }

  /**
   * Tìm quan hệ cụ thể giữa bill và user
   */
  async findByBillAndUser(billId: number, userId: number): Promise<BillUserEntity | null> {
    return this.findOne({
      where: { billId, userId, isActive: true },
      relations: ['bill', 'user'],
    });
  }

  /**
   * Tìm tất cả người dùng chưa thanh toán trong một hóa đơn
   */
  async findUnpaidUsersByBillId(billId: number): Promise<BillUserEntity[]> {
    return this.find({
      where: { billId, is_paid: false, isActive: true },
      relations: ['user'],
    });
  }

  /**
   * Tính tổng số tiền đã thanh toán cho một hóa đơn
   */
  async getTotalPaidAmountByBillId(billId: number): Promise<number> {
    const result = await this.createQueryBuilder('billUser')
      .select('SUM(billUser.amount_to_pay)', 'total')
      .where('billUser.billId = :billId', { billId })
      .andWhere('billUser.is_paid = true')
      .andWhere('billUser.isActive = true')
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  /**
   * Tính tổng số tiền chưa thanh toán cho một hóa đơn
   */
  async getTotalUnpaidAmountByBillId(billId: number): Promise<number> {
    const result = await this.createQueryBuilder('billUser')
      .select('SUM(billUser.amount_to_pay)', 'total')
      .where('billUser.billId = :billId', { billId })
      .andWhere('billUser.is_paid = false')
      .andWhere('billUser.isActive = true')
      .getRawOne();

    return parseFloat(result?.total || '0');
  }
}