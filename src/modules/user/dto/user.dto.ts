import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsObject,
  ValidateNested,
  MinLength,
  IsUrl,
} from 'class-validator';
import { Type, Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseDto } from '@/common';
import { UserRole } from '@/common';

/**
 * DTO chứa thông tin ngân hàng của người dùng
 * Được sử dụng để lưu trữ thông tin thanh toán
 */
export class BankInfoDto {
  @ApiPropertyOptional({
    description: 'Tên ngân hàng',
    example: 'Vietcombank',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({
    description: 'Số tài khoản ngân hàng',
    example: '1234567890',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({
    description: 'Tên chủ tài khoản',
    example: 'Nguyen Van A',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  accountHolderName?: string;

  @ApiPropertyOptional({
    description: 'Mã ngân hàng (Bank code)',
    example: 'VCB',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  bankCode?: string;
}

/**
 * DTO để tạo người dùng mới
 * Chứa tất cả thông tin cần thiết để đăng ký tài khoản
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Địa chỉ email của người dùng (duy nhất)',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Tên hiển thị của người dùng',
    example: 'Nguyễn Văn A',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
    example: 'password123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Thông tin ngân hàng để thanh toán',
    type: BankInfoDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BankInfoDto)
  bankInfo?: BankInfoDto;

  @ApiPropertyOptional({
    description: 'Vai trò của người dùng trong hệ thống',
    enum: UserRole,
    default: UserRole.USER,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

/**
 * DTO để cập nhật thông tin người dùng
 * Tất cả các field đều optional để hỗ trợ partial update
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Địa chỉ email mới của người dùng',
    example: 'newemail@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Tên hiển thị mới của người dùng',
    example: 'Nguyễn Văn B',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu mới (tối thiểu 6 ký tự)',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Cập nhật thông tin ngân hàng',
    type: BankInfoDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BankInfoDto)
  bankInfo?: BankInfoDto;

  @ApiPropertyOptional({
    description: 'Cập nhật vai trò người dùng',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động của tài khoản',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện mới',
    example: 'https://example.com/new-avatar.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

/**
 * DTO response cho thông tin người dùng
 * Sử dụng để serialize dữ liệu trả về client, ẩn thông tin nhạy cảm
 */
export class UserResponseDto extends BaseDto {
  @ApiProperty({
    description: 'ID duy nhất của người dùng',
    example: 1,
  })
  @Expose()
  declare id: number;

  @ApiProperty({
    description: 'Địa chỉ email của người dùng',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    description: 'Tên hiển thị của người dùng',
    example: 'Nguyễn Văn A',
  })
  @Expose()
  name?: string;

  @ApiProperty({
    description: 'Mật khẩu (luôn được ẩn trong response)',
    writeOnly: true,
  })
  @Exclude()
  password?: string;

  @ApiPropertyOptional({
    description: 'Thông tin ngân hàng',
    type: BankInfoDto,
  })
  @Expose()
  bankInfo?: BankInfoDto;

  @ApiProperty({
    description: 'Vai trò của người dùng',
    enum: UserRole,
    example: UserRole.USER,
  })
  @Expose()
  role: UserRole;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện',
    example: 'https://example.com/avatar.jpg',
  })
  @Expose()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2024-01-01T00:00:00Z',
  })
  @Expose()
  declare createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    example: '2024-01-01T12:00:00Z',
  })
  @Expose()
  declare updatedAt: Date;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  @Expose()
  declare isActive: boolean;
}
