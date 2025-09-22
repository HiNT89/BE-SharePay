import {
  IsNumber,
  IsBoolean,
  IsOptional,
  IsString,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@/common';

/**
 * DTO để tạo mới quan hệ Bill-User (thêm user vào hóa đơn)
 */
export class CreateBillUserDto {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  billId: number;

  @ApiProperty({
    description: 'ID của người dùng',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    description: 'Tỷ lệ chia phần (share ratio)',
    example: 1.0,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  share_ratio: number = 1.0;

  @ApiProperty({
    description: 'Số tiền người dùng cần thanh toán',
    example: 75000,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount_to_pay: number;

  @ApiPropertyOptional({
    description: 'Ghi chú về khoản thanh toán',
    example: 'Chia đều cho 2 người',
  })
  @IsOptional()
  @IsString()
  payment_note?: string;
}

/**
 * DTO để cập nhật thông tin thanh toán
 */
export class UpdateBillUserDto {
  @ApiPropertyOptional({
    description: 'Số tiền người dùng cần thanh toán',
    example: 75000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount_to_pay?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái thanh toán',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;

  @ApiPropertyOptional({
    description: 'Ghi chú về khoản thanh toán',
    example: 'Đã thanh toán qua chuyển khoản',
  })
  @IsOptional()
  @IsString()
  payment_note?: string;

  @ApiPropertyOptional({
    description: 'Ngày thanh toán thực tế (ISO string)',
    example: '2024-01-01T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  paid_at?: string;
}

/**
 * DTO để đánh dấu thanh toán
 */
export class MarkPaidDto {
  @ApiPropertyOptional({
    description: 'Ghi chú về việc thanh toán',
    example: 'Đã thanh toán bằng tiền mặt',
  })
  @IsOptional()
  @IsString()
  payment_note?: string;
}

/**
 * DTO phản hồi thông tin BillUser
 */
export class BillUserResponseDto extends BaseDto {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  @Expose()
  billId: number;

  @ApiProperty({
    description: 'ID của người dùng',
    example: 1,
  })
  @Expose()
  userId: number;

  @ApiProperty({
    description: 'Số tiền người dùng cần thanh toán',
    example: 75000,
  })
  @Expose()
  amount_to_pay: number;

  @ApiProperty({
    description: 'Trạng thái thanh toán',
    example: false,
  })
  @Expose()
  is_paid: boolean;

  @ApiPropertyOptional({
    description: 'Ghi chú về khoản thanh toán',
    example: 'Chia đều cho 2 người',
  })
  @Expose()
  payment_note?: string;

  @ApiPropertyOptional({
    description: 'Ngày thanh toán thực tế',
    example: '2024-01-01T12:00:00Z',
  })
  @Expose()
  paid_at?: Date;

  @ApiPropertyOptional({
    description: 'Thông tin người dùng',
  })
  @Expose()
  user?: {
    id: number;
    name?: string;
    email: string;
    avatarUrl?: string;
  };

  @ApiPropertyOptional({
    description: 'Thông tin hóa đơn',
  })
  @Expose()
  bill?: {
    id: number;
    title: string;
    total_amount: number;
    currency_code: string;
  };
}

/**
 * DTO để chia hóa đơn cho nhiều người
 */
export class SplitBillDto {
  @ApiProperty({
    description: 'ID của hóa đơn cần chia',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  billId: number;

  @ApiProperty({
    description: 'Danh sách người dùng và số tiền tương ứng',
    type: [Object],
    example: [
      { userId: 1, amount_to_pay: 75000, payment_note: 'Phần của An' },
      { userId: 2, amount_to_pay: 75000, payment_note: 'Phần của Bình' },
    ],
  })
  users: Array<{
    userId: number;
    amount_to_pay: number;
    payment_note?: string;
  }>;
}
