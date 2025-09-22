import { BaseAbstractEntity } from '@/common/base/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entity BillItem - Đại diện cho các món/sản phẩm trong hóa đơn
 * Chứa thông tin chi tiết về từng item trong bill
 */
@Entity('bill_items')
export class BillItemEntity extends BaseAbstractEntity {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  @Column({ name: 'bill_id' })
  billId: number;

  @ApiProperty({
    description: 'Tên sản phẩm/món ăn',
    example: 'Phở bò',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Đơn giá',
    example: 50000,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unit_price: number;

  @ApiProperty({
    description: 'Số lượng',
    example: 2,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
  quantity: number;

  @ApiPropertyOptional({
    description: 'Số tiền giảm giá',
    example: 5000,
    type: 'number',
  })
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    default: 0,
  })
  discount?: number;

  @ApiPropertyOptional({
    description: 'Phần trăm giảm giá',
    example: 10,
    type: 'number',
  })
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    default: 0,
  })
  discount_percent?: number;

  @ApiProperty({
    description: 'Tổng tiền của item (unit_price * quantity - discount)',
    example: 95000,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_amount: number;

  @ApiPropertyOptional({
    description: 'Ghi chú cho item',
    example: 'Không hành',
  })
  @Column({ type: 'text', nullable: true })
  note?: string;

  // Quan hệ với Bill
  @ManyToOne('BillEntity', 'billItems', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bill_id' })
  bill: any;

  // Quan hệ với BillItemPayer
  @OneToMany('BillItemPayerEntity', 'billItem')
  billItemPayers: any[];
}
