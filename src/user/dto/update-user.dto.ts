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
}
