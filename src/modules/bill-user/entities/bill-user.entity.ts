import { BaseAbstractEntity } from '@/common/base/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entity BillUser - Bảng trung gian cho quan hệ many-to-many giữa Bill và User
 * Lưu thông tin về số tiền mỗi user cần thanh toán cho từng hóa đơn
 */
@Entity('bill_users')
export class BillUserEntity extends BaseAbstractEntity {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  @Column({ name: 'bill_id' })
  billId: number;

  @ApiProperty({
    description: 'ID của người dùng',
    example: 1,
  })
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({
    description: 'Tỷ lệ chia phần (share ratio)',
    example: 1.0,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1.0 })
  share_ratio: number;

  @ApiProperty({
    description: 'Số tiền người dùng cần thanh toán',
    example: 75000,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount_to_pay: number;

  @ApiProperty({
    description: 'Trạng thái thanh toán',
    example: false,
    default: false,
  })
  @Column({ default: false })
  is_paid: boolean;

  @ApiProperty({
    description: 'Trạng thái đã đối soát/thanh toán xong',
    example: false,
    default: false,
  })
  @Column({ default: false })
  is_settled: boolean;

  @ApiPropertyOptional({
    description: 'Thời gian đối soát hoàn tất',
    example: '2024-01-01T12:00:00Z',
  })
  @Column({ type: 'timestamp', nullable: true })
  settled_at?: Date;

  @ApiPropertyOptional({
    description: 'Ghi chú về khoản thanh toán',
    example: 'Chia đều cho 2 người',
  })
  @Column({ type: 'text', nullable: true })
  payment_note?: string;

  @ApiPropertyOptional({
    description: 'Ngày thanh toán thực tế',
    example: '2024-01-01T12:00:00Z',
  })
  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;

  // Quan hệ với Bill
  @ManyToOne('BillEntity', 'billUsers', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bill_id' })
  bill: any;

  // Quan hệ với User
  @ManyToOne('UserEntity', 'billUsers', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: any;
}
