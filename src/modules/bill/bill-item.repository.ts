import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillItemEntity } from './entities/bill-item.entity';
import { BaseAbstractRepository, BaseInterfaceRepository } from '@/common';

export class BillItemRepository
  extends BaseAbstractRepository<BillItemEntity>
  implements BaseInterfaceRepository<BillItemEntity>
{
  constructor(
    @InjectRepository(BillItemEntity)
    private readonly billItemRepository: Repository<BillItemEntity>,
  ) {
    super(billItemRepository);
  }

  /**
   * Tìm tất cả items của một bill
   */
  async findByBillId(billId: number): Promise<BillItemEntity[]> {
    return this.billItemRepository.find({
      where: { billId },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Tính tổng tiền của tất cả items trong một bill
   */
  async getTotalAmountByBillId(billId: number): Promise<number> {
    const result = await this.billItemRepository
      .createQueryBuilder('item')
      .select('SUM(item.total_amount)', 'total')
      .where('item.billId = :billId', { billId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  /**
   * Cập nhật total_amount dựa trên unit_price, quantity và discount
   */
  async calculateAndUpdateTotalAmount(itemId: number): Promise<void> {
    await this.billItemRepository
      .createQueryBuilder()
      .update(BillItemEntity)
      .set({
        total_amount: () => `(unit_price * quantity) - COALESCE(discount, 0)`,
      })
      .where('id = :itemId', { itemId })
      .execute();
  }

  /**
   * Xóa bill item
   */
  async deleteById(id: number): Promise<void> {
    await this.billItemRepository.delete(id);
  }
}
