import { BaseAbstractEntity } from '@/common/base/base.entity';
// import { Bill } from '@/modules/bill/entities/bill.entity';
// import { Paid } from '@/modules/paid/entities/paid.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@/common';

/**
 * Enum định nghĩa các vai trò người dùng trong hệ thống
 * - USER: Người dùng thông thường
 * - ADMIN: Quản trị viên có toàn quyền
 * - MODERATOR: Người kiểm duyệt với quyền hạn trung gian
 */

/**
 * Entity User - Đại diện cho bảng users trong database
 * Chứa thông tin cơ bản của người dùng và các quan hệ với các entity khác
 *
 * Quan hệ:
 * - OneToMany với Bill: Một user có thể tạo nhiều hóa đơn
 * - OneToMany với Paid: Một user có thể có nhiều bản ghi thanh toán
 */
@Entity('users')
export class UserEntity extends BaseAbstractEntity {
  @ApiProperty({
    description: 'Địa chỉ email duy nhất của người dùng',
    example: 'user@example.com',
    uniqueItems: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiPropertyOptional({
    description: 'Tên hiển thị của người dùng',
    example: 'Nguyễn Văn A',
    maxLength: 100,
  })
  @Column({ type: 'text', nullable: true })
  name?: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu đã được hash (không hiển thị trong API response)',
    writeOnly: true,
  })
  @Column({ type: 'text', nullable: true })
  password?: string;

  @ApiPropertyOptional({
    description: 'Thông tin ngân hàng để thanh toán',
    example: {
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      accountHolderName: 'Nguyen Van A',
    },
  })
  @Column({ type: 'jsonb', nullable: true })
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
  };

  @ApiProperty({
    description: 'Vai trò của người dùng trong hệ thống',
    enum: UserRole,
    default: UserRole.USER,
    example: UserRole.USER,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
    format: 'url',
  })
  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  // Quan hệ với BillUser (bảng trung gian)
  @OneToMany('BillUserEntity', 'user')
  billUsers: any[];

  // @ApiPropertyOptional({
  //   description: 'Danh sách các hóa đơn được tạo bởi người dùng này',
  //   type: () => [Bill],
  //   readOnly: true,
  // })
  // @OneToMany(() => Bill, (bill) => bill.userCreateId)
  // bills: Bill[];

  // @ApiPropertyOptional({
  //   description: 'Danh sách các bản ghi thanh toán của người dùng này',
  //   type: () => [Paid],
  //   readOnly: true,
  // })
  // @OneToMany(() => Paid, (paid) => paid.user_id)
  // paids: Paid[];
}
