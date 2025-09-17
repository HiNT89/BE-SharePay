import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID của người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyễn',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Họ của người dùng',
    example: 'Văn A',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'Vai trò của người dùng',
    enum: UserRole,
  })
  @Expose()
  role: UserRole;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Ngày tạo tài khoản',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Ngày cập nhật cuối',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;
}
