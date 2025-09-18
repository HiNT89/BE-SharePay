// Import PartialType để tạo DTO có tất cả field optional
import { PartialType } from '@nestjs/swagger';

// Import base DTO
import { CreateUserDto } from './create-user.dto';

// Import validator và Swagger decorator
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO cho việc cập nhật thông tin người dùng
 *
 * Kế thừa từ CreateUserDto với PartialType:
 * - Tất cả field từ CreateUserDto trở thành optional
 * - Cho phép cập nhật một phần thông tin (partial update)
 * - Thêm field isActive để quản lý trạng thái tài khoản
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * Trạng thái hoạt động của tài khoản
   * Optional - chỉ cập nhật khi có giá trị
   */
  @ApiProperty({
    description: 'Trạng thái hoạt động của tài khoản',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: boolean;

  /**
   * Thông tin ngân hàng của người dùng - optional
   * Có thể bao gồm tên ngân hàng, số tài khoản, chi nhánh, v.v.
   */
  @ApiProperty({
    description: 'Thông tin ngân hàng của người dùng dưới dạng JSON',
    example: {
      accountNumber: '123456789',
      bankName: 'Ngân hàng A',
      bankCode: 'B001',
      accountHolderName: 'Nguyen Van A',
    },
    required: false,
  })
  @IsOptional()
  bankInfo?: Record<string, any>;

  /**
   * Thông tin ngân hàng của người dùng - optional
   * Có thể bao gồm tên ngân hàng, số tài khoản, chi nhánh, v.v.
   */
  @ApiProperty({
    description: 'Ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  avatar_url?: string;

  /**
   * Tên của người dùng - optional
   */
  @ApiProperty({
    description: 'Ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  lastName?: string;

  /**
   * Họ của người dùng - optional
   */
  @ApiProperty({
    description: 'Ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  firstName?: string;
}
