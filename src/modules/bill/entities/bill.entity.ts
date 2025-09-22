import { BaseAbstractEntity } from '@/common/base/base.entity';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entity Bill - Đại diện cho bảng bills trong database
 * Chứa thông tin về hóa đơn chi tiêu
 */
@Entity('bills')
export class BillEntity extends BaseAbstractEntity {
  @ApiProperty({
    description: 'Tiêu đề của hóa đơn',
    example: 'Hóa đơn ăn trưa',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'ID của người tạo hóa đơn',
    example: 1,
  })
  @Column({ name: 'user_created_id' })
  user_created_id: number;

  @ApiProperty({
    description: 'Tổng số tiền của hóa đơn',
    example: 150000,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_amount: number;

  @ApiProperty({
    description: 'Tổng số tiền gốc của hóa đơn (trước khi có thay đổi)',
    example: 150000,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  original_total_amount: number;

  @ApiPropertyOptional({
    description: 'Ghi chú cho hóa đơn',
    example: 'Ăn trưa tại nhà hàng ABC',
  })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh của hóa đơn',
    example: 'https://example.com/bill-image.jpg',
    format: 'url',
  })
  @Column({ type: 'text', nullable: true })
  image_url?: string;

  @ApiPropertyOptional({
    description: 'Số tiền giảm giá',
    example: 15000,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  discount?: number;

  @ApiPropertyOptional({
    description: 'Phần trăm giảm giá',
    example: 10,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percent_discount?: number;

  @ApiProperty({
    description: 'Mã tiền tệ',
    example: 'VND',
    default: 'VND',
  })
  @Column({ default: 'VND' })
  currency_code: string;

  // Quan hệ với User (người tạo hóa đơn)
  @ManyToOne('UserEntity', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_created_id' })
  userCreated: any;

  // Quan hệ với BillUser (bảng trung gian)
  @OneToMany('BillUserEntity', 'bill')
  billUsers: any[];

  // Quan hệ với BillItem
  @OneToMany('BillItemEntity', 'bill')
  billItems: any[];
}
