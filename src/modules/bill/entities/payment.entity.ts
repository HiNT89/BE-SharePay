import { BaseAbstractEntity } from '@/common/base/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entity Payment - Đại diện cho các khoản thanh toán thực tế
 * Lưu thông tin về việc thanh toán đối soát giữa các thành viên
 */
@Entity('payments')
export class PaymentEntity extends BaseAbstractEntity {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  @Column({ name: 'bill_id' })
  billId: number;

  @ApiProperty({
    description: 'ID của người thanh toán',
    example: 1,
  })
  @Column({ name: 'payer_id' })
  payerId: number;

  @ApiProperty({
    description: 'Số tiền thanh toán',
    example: 25000,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'bank_transfer',
    enum: ['cash', 'bank_transfer', 'e_wallet', 'credit_card', 'other'],
  })
  @Column({ default: 'cash' })
  method: string;

  @ApiPropertyOptional({
    description: 'Ghi chú về khoản thanh toán',
    example: 'Chuyển khoản qua VietcomBank',
  })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @ApiPropertyOptional({
    description: 'URL chứng từ thanh toán (ảnh chụp, screenshot...)',
    example: 'https://example.com/payment-proof.jpg',
  })
  @Column({ type: 'text', nullable: true })
  proof_url?: string;

  @ApiProperty({
    description: 'Thời gian thanh toán',
    example: '2024-01-01T12:00:00Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paid_at: Date;

  // Quan hệ với Bill
  @ManyToOne('BillEntity', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bill_id' })
  bill: any;

  // Quan hệ với User (người thanh toán)
  @ManyToOne('UserEntity', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'payer_id' })
  payer: any;
}
