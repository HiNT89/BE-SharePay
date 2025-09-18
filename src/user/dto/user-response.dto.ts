// Import class-transformer decorators để kiểm soát serialization
import { Exclude, Expose } from 'class-transformer';

// Import Swagger decorator
import { ApiProperty } from '@nestjs/swagger';

// Import enum UserRole
import { UserRole } from '../user.entity';

/**
 * DTO cho response trả về thông tin người dùng
 *
 * Chức năng:
 * - Định nghĩa cấu trúc dữ liệu trả về cho client
 * - Loại bỏ sensitive data (như password) khỏi response
 * - Tạo Swagger documentation cho response
 * - Sử dụng @Expose() để chỉ cho phép những field được chỉ định
 */
export class UserResponseDto {
  /**
   * ID của người dùng
   */
  @ApiProperty({
    description: 'ID của người dùng',
    example: 1,
  })
  @Expose()
  id: number;

  /**
   * Email của người dùng
   */
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  /**
   * Tên của người dùng
   */
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyễn',
  })
  @Expose()
  firstName: string;

  /**
   * Họ của người dùng
   */
  @ApiProperty({
    description: 'Họ của người dùng',
    example: 'Văn A',
  })
  @Expose()
  lastName: string;

  /**
   * Vai trò của người dùng trong hệ thống
   */
  @ApiProperty({
    description: 'Vai trò của người dùng',
    enum: UserRole,
  })
  @Expose()
  role: UserRole;

  /**
   * Trạng thái hoạt động của tài khoản
   */
  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  @Expose()
  isActive: boolean;

  /**
   * Thời gian tạo tài khoản
   */
  @ApiProperty({
    description: 'Ngày tạo tài khoản',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  /**
   * Thời gian cập nhật cuối cùng
   */
  @ApiProperty({
    description: 'Ngày cập nhật cuối',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  /**
   * Password - KHÔNG BAO GIỜ trả về trong response
   * @Exclude() đảm bảo field này sẽ bị loại bỏ khỏi JSON response
   */
  @Exclude()
  password: string;
}
