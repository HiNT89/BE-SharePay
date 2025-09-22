import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillItemPayerEntity } from './entities/bill-item-payer.entity';
import { BaseAbstractRepository, BaseInterfaceRepository } from '@/common';

export class BillItemPayerRepository
  extends BaseAbstractRepository<BillItemPayerEntity>
  implements BaseInterfaceRepository<BillItemPayerEntity>
{
  constructor(
    @InjectRepository(BillItemPayerEntity)
    private readonly billItemPayerRepository: Repository<BillItemPayerEntity>,
  ) {
    super(billItemPayerRepository);
  }

  /**
   * Tìm tất cả payers của một item
   */
  async findByBillItemId(billItemId: number): Promise<BillItemPayerEntity[]> {
    return this.billItemPayerRepository.find({
      where: { billItemId },
      relations: ['payer'],
    });
  }

  /**
   * Tìm tất cả các khoản ứng trước của một user trong một bill
   */
  async findByPayerIdAndBillId(
    payerId: number,
    billId: number,
  ): Promise<BillItemPayerEntity[]> {
    return this.billItemPayerRepository
      .createQueryBuilder('payer')
      .innerJoin('payer.billItem', 'item')
      .where('payer.payerId = :payerId', { payerId })
      .andWhere('item.billId = :billId', { billId })
      .getMany();
  }

  /**
   * Tính tổng tiền ứng trước của một user trong một bill
   */
  async getTotalPrepaidByUserAndBill(
    payerId: number,
    billId: number,
  ): Promise<number> {
    const result = await this.billItemPayerRepository
      .createQueryBuilder('payer')
      .select('SUM(payer.amount)', 'total')
      .innerJoin('payer.billItem', 'item')
      .where('payer.payerId = :payerId', { payerId })
      .andWhere('item.billId = :billId', { billId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  /**
   * Tính tổng tiền ứng trước cho một item
   */
  async getTotalPrepaidByItem(billItemId: number): Promise<number> {
    const result = await this.billItemPayerRepository
      .createQueryBuilder('payer')
      .select('SUM(payer.amount)', 'total')
      .where('payer.billItemId = :billItemId', { billItemId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  /**
   * Xóa bill item payer
   */
  async deleteById(id: number): Promise<void> {
    await this.billItemPayerRepository.delete(id);
  }
}
