import { BaseEntity } from '@/common/base/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { BillItem } from '@/modules/bill-item/entities/bill-item.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entity Bill - Đại diện cho bảng bill trong database
 * Chứa thông tin về hóa đơn chia sẻ chi phí
 *
 * Quan hệ:
 * - ManyToOne với User: Một hóa đơn được tạo bởi một người dùng
 * - OneToMany với BillItem: Một hóa đơn có thể chứa nhiều items
 */
@Entity('bill')
export class Bill extends BaseEntity {
  @ApiProperty({
    description: 'Tiêu đề/tên của hóa đơn',
    example: 'Tiền cơm trưa nhóm',
    maxLength: 255,
  })
  @Column({ type: 'text' })
  title: string;

  @ApiProperty({
    description: 'Mã tiền tệ của hóa đơn',
    example: 'VND',
    default: 'VND',
  })
  @Column({ type: 'text', default: 'VND' })
  currency_code: string;

  @ApiProperty({
    description: 'Tổng số tiền của hóa đơn',
    example: 500000,
    type: Number,
    minimum: 0,
  })
  @Column({ type: 'numeric' })
  total_amount: number;

  @ApiProperty({
    description: 'Ghi chú chi tiết về hóa đơn',
    example: 'Ăn trưa tại nhà hàng ABC, chia đều cho 4 người',
    maxLength: 1000,
  })
  @Column({ type: 'text' })
  note: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh hóa đơn (ảnh chụp bill)',
    example: 'https://example.com/bill-image.jpg',
    format: 'url',
  })
  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @ApiProperty({
    description: 'Thông tin người tạo hóa đơn',
    type: () => User,
    readOnly: true,
  })
  @ManyToOne(() => User, (user) => user.bills)
  @JoinColumn({ name: 'userCreateId' })
  user: User;

  @ApiProperty({
    description: 'ID của người dùng tạo hóa đơn',
    example: 1,
  })
  @Column({ nullable: true })
  userCreateId: number;

  @ApiPropertyOptional({
    description: 'Danh sách các items trong hóa đơn',
    type: () => [BillItem],
    isArray: true,
    readOnly: true,
  })
  @OneToMany(() => BillItem, (billItem) => billItem.bill)
  billItems: BillItem[];
}
