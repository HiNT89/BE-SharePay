// Import các validator từ class-validator để validate dữ liệu đầu vào
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

// Import decorator để tạo Swagger documentation
import { ApiProperty } from '@nestjs/swagger';

// Import enum UserRole từ entity
import { UserRole } from '../user.entity';

/**
 * DTO (Data Transfer Object) cho việc tạo người dùng mới
 *
 * Chức năng:
 * - Định nghĩa cấu trúc dữ liệu đầu vào cho API tạo user
 * - Validate dữ liệu với class-validator
 * - Tạo Swagger documentation tự động
 */
export class CreateUserDto {
  /**
   * Email của người dùng - phải là email hợp lệ và duy nhất
   */
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  /**
   * Tên của người dùng
   */
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyễn',
  })
  @IsString({ message: 'Tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  full_name: string;

  /**
   * Mật khẩu - tối thiểu 6 ký tự (sẽ được hash tự động)
   */
  @ApiProperty({
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

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
      accountHolderName: 'Nguyễn Văn A',
    },
    required: false,
  })
  @IsOptional()
  bank_info?: Record<string, any>;

  /**
   * Vai trò của người dùng - optional, mặc định là USER
   */
  @ApiProperty({
    description: 'Vai trò của người dùng',
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role?: UserRole;

  /**
   * Ảnh đại diện của người dùng - optional
   */
  @ApiProperty({
    description: 'Ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'URL ảnh đại diện phải là chuỗi' })
  avatar_url?: string;
}
