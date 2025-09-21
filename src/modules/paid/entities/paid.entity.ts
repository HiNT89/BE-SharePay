import { BaseEntity } from '@/common/base/base.entity';
import { BillItem } from '@/modules/bill-item/entities/bill-item.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity Paid - Đại diện cho bảng paid trong database
 * Chứa thông tin về việc thanh toán của từng người cho các items trong hóa đơn
 *
 * Quan hệ:
 * - ManyToOne với User: Nhiều bản ghi thanh toán của một người dùng
 * - ManyToOne với BillItem: Nhiều bản ghi thanh toán cho một item (chia sẻ)
 *
 * Ý nghĩa: Entity này ghi lại ai trả bao nhiều tiền cho item nào trong hóa đơn chia sẻ
 */
@Entity('paid')
export class Paid extends BaseEntity {
  @ApiProperty({
    description: 'Thông tin người dùng thực hiện thanh toán',
    type: () => User,
    readOnly: true,
  })
  @ManyToOne(() => User, (user) => user.bills)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'Thông tin item được thanh toán',
    type: () => BillItem,
    readOnly: true,
  })
  @ManyToOne(() => BillItem, (billItem) => billItem.paidList)
  @JoinColumn({ name: 'bill_item_id' })
  billItem: BillItem;

  @ApiProperty({
    description: 'ID của người dùng thực hiện thanh toán',
    example: 1,
  })
  @Column({ nullable: true, type: 'numeric' })
  user_id: number;

  @ApiProperty({
    description: 'ID của item trong hóa đơn được thanh toán',
    example: 1,
  })
  @Column({ nullable: true, type: 'numeric' })
  bill_item_id: number;

  @ApiProperty({
    description: 'Tỷ lệ phần trăm thanh toán cho item này (0-100%)',
    example: 50.0,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  @Column({ nullable: true, type: 'numeric', precision: 5, scale: 2 })
  percent: number;

  @ApiProperty({
    description: 'Số tiền thực tế đã thanh toán (VND)',
    example: 25000,
    type: Number,
    minimum: 0,
  })
  @Column({ nullable: true, type: 'numeric' })
  amount: number;
}
