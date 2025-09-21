import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/base/base.response.dto';
import { UserResponseDto } from '@/modules/user/dto/user.dto';
import { BillItemResponseDto } from '@/modules/bill-item/dto/bill-item.dto';

/**
 * DTO để tạo hóa đơn mới
 * Chứa thông tin cơ bản cần thiết để tạo một hóa đơn chia sẻ chi phí
 */
export class CreateBillDto {
  @ApiProperty({
    description: 'ID của người dùng tạo hóa đơn',
    example: 1,
    type: Number,
  })
  @IsNumber()
  userCreateId: number;

  @ApiProperty({
    description: 'Tổng số tiền của hóa đơn (VND)',
    example: 500000,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  total_amount: number;

  @ApiProperty({
    description: 'Tiêu đề/tên của hóa đơn',
    example: 'Tiền cơm trưa nhóm',
    maxLength: 255,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Ghi chú chi tiết về hóa đơn',
    example: 'Ăn trưa tại nhà hàng ABC, chia đều cho 4 người',
    maxLength: 1000,
  })
  @IsString()
  note: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh hóa đơn (ảnh chụp bill, hóa đơn)',
    example: 'https://example.com/bill-image.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

/**
 * DTO để cập nhật thông tin hóa đơn
 * Hỗ trợ cập nhật các thông tin cơ bản của hóa đơn
 */
export class UpdateBillDto {
  @ApiProperty({
    description: 'ID của người dùng tạo hóa đơn (không thể thay đổi)',
    example: 1,
    type: Number,
  })
  @IsNumber()
  userCreateId: number;

  @ApiProperty({
    description: 'Tổng số tiền mới của hóa đơn (VND)',
    example: 600000,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  total_amount: number;

  @ApiProperty({
    description: 'Tiêu đề/tên mới của hóa đơn',
    example: 'Tiền cơm tối nhóm',
    maxLength: 255,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Ghi chú mới về hóa đơn',
    example: 'Ăn tối tại nhà hàng XYZ, chia đều cho 5 người',
    maxLength: 1000,
  })
  @IsString()
  note: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh hóa đơn mới',
    example: 'https://example.com/new-bill-image.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

/**
 * DTO response cho thông tin hóa đơn
 * Được sử dụng để serialize dữ liệu hóa đơn trả về client
 * Bao gồm thông tin người tạo và các item trong hóa đơn
 */
export class BillResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Tiêu đề của hóa đơn',
    example: 'Tiền cơm trưa nhóm',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Mã tiền tệ',
    example: 'VND',
    default: 'VND',
  })
  @Expose()
  currency_code: string;

  @ApiProperty({
    description: 'Tổng số tiền của hóa đơn',
    example: 500000,
    type: Number,
  })
  @Expose()
  total_amount: number;

  @ApiProperty({
    description: 'Ghi chú về hóa đơn',
    example: 'Ăn trưa tại nhà hàng ABC, chia đều cho 4 người',
  })
  @Expose()
  note: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh hóa đơn',
    example: 'https://example.com/bill-image.jpg',
  })
  @Expose()
  imageUrl?: string;

  @ApiProperty({
    description: 'Thông tin người tạo hóa đơn',
    type: () => UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({
    description: 'ID của người tạo hóa đơn',
    example: 1,
  })
  @Expose()
  userCreateId: number;

  @ApiProperty({
    description: 'Danh sách các item trong hóa đơn',
    type: () => [BillItemResponseDto],
    isArray: true,
  })
  @Expose()
  @Type(() => BillItemResponseDto)
  billItems: BillItemResponseDto[];
}
