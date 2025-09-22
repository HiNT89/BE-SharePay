import { BaseAbstractEntity } from '@/common/base/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entity BillItemPayer - Đại diện cho người ứng tiền trước cho từng item
 * Lưu thông tin về ai ứng tiền cho item nào và bao nhiêu
 */
@Entity('bill_item_payers')
export class BillItemPayerEntity extends BaseAbstractEntity {
  @ApiProperty({
    description: 'ID của bill item',
    example: 1,
  })
  @Column({ name: 'bill_item_id' })
  billItemId: number;

  @ApiProperty({
    description: 'ID của người ứng tiền',
    example: 1,
  })
  @Column({ name: 'payer_id' })
  payerId: number;

  @ApiProperty({
    description: 'Số tiền thực tế ứng trước',
    example: 50000,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @ApiPropertyOptional({
    description: 'Phần trăm ứng trước (nếu tính theo %)',
    example: 50.0,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percent?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú về việc ứng tiền',
    example: 'Ứng trước 50% tổng bill',
  })
  @Column({ type: 'text', nullable: true })
  note?: string;

  // Quan hệ với BillItem
  @ManyToOne('BillItemEntity', 'billItemPayers', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bill_item_id' })
  billItem: any;

  // Quan hệ với User (người ứng tiền)
  @ManyToOne('UserEntity', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'payer_id' })
  payer: any;
}
