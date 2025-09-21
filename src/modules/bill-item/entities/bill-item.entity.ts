import { BaseEntity } from '@/common/base/base.entity';
import { Bill } from '@/modules/bill/entities/bill.entity';
import { Paid } from '@/modules/paid/entities/paid.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity BillItem - Đại diện cho bảng bill-item trong database
 * Chứa thông tin về các items/món ăn/sản phẩm trong mỗi hóa đơn
 *
 * Quan hệ:
 * - ManyToOne với Bill: Nhiều items thuộc về một hóa đơn
 * - OneToMany với Paid: Một item có thể có nhiều bản ghi thanh toán (chia sẻ)
 */
@Entity('bill-item')
export class BillItem extends BaseEntity {
  @ApiProperty({
    description: 'Tên của item/món ăn/sản phẩm',
    example: 'Cơm gà',
    maxLength: 255,
  })
  @Column({ nullable: true, type: 'text' })
  name: string;

  @ApiProperty({
    description: 'Thông tin hóa đơn chứa item này',
    type: () => Bill,
    readOnly: true,
  })
  @ManyToOne(() => Bill, (bill) => bill.billItems)
  @JoinColumn({ name: 'bill_id' })
  bill: Bill;

  @ApiProperty({
    description: 'ID của hóa đơn chứa item này',
    example: 1,
  })
  @Column({ nullable: true, type: 'numeric' })
  bill_id: number;

  @ApiProperty({
    description: 'Giá của một đơn vị item (VND)',
    example: 50000,
    type: Number,
    minimum: 0,
  })
  @Column({ nullable: true, type: 'numeric' })
  price: number;

  @ApiProperty({
    description: 'Số lượng của item',
    example: 2,
    type: Number,
    minimum: 1,
  })
  @Column({ nullable: true, type: 'numeric' })
  quantity: number;

  @ApiProperty({
    description: 'Danh sách các bản ghi thanh toán cho item này',
    type: () => [Paid],
    isArray: true,
    readOnly: true,
  })
  @OneToMany(() => Paid, (paid) => paid.billItem)
  paidList: Paid[];
}
