import {
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
  MinLength,
  IsPositive,
  Min,
  Max,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseDto } from '@/common';

/**
 * DTO để tạo mới một hóa đơn
 */
export class CreateBillDto {
  @ApiProperty({
    description: 'Tiêu đề của hóa đơn',
    example: 'Hóa đơn ăn trưa',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'ID của người tạo hóa đơn',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  user_created_id: number;

  @ApiProperty({
    description: 'Tổng số tiền của hóa đơn',
    example: 150000,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  total_amount: number;

  @ApiProperty({
    description: 'Tổng số tiền gốc của hóa đơn (trước khi có thay đổi)',
    example: 150000,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  original_total_amount: number;

  @ApiPropertyOptional({
    description: 'Ghi chú cho hóa đơn',
    example: 'Ăn trưa tại nhà hàng ABC',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh của hóa đơn',
    example: 'https://example.com/bill-image.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiPropertyOptional({
    description: 'Số tiền giảm giá',
    example: 15000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Phần trăm giảm giá (0-100)',
    example: 10,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  percent_discount?: number;

  @ApiProperty({
    description: 'Mã tiền tệ',
    example: 'VND',
    default: 'VND',
  })
  @IsString()
  currency_code: string = 'VND';
}

/**
 * DTO để cập nhật thông tin hóa đơn
 */
export class UpdateBillDto {
  @ApiPropertyOptional({
    description: 'Tiêu đề của hóa đơn',
    example: 'Hóa đơn ăn trưa',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({
    description: 'Tổng số tiền của hóa đơn',
    example: 150000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  total_amount?: number;

  @ApiPropertyOptional({
    description: 'Tổng số tiền gốc của hóa đơn (trước khi có thay đổi)',
    example: 150000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  original_total_amount?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú cho hóa đơn',
    example: 'Ăn trưa tại nhà hàng ABC',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh của hóa đơn',
    example: 'https://example.com/bill-image.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiPropertyOptional({
    description: 'Số tiền giảm giá',
    example: 15000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Phần trăm giảm giá (0-100)',
    example: 10,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  percent_discount?: number;

  @ApiPropertyOptional({
    description: 'Mã tiền tệ',
    example: 'VND',
  })
  @IsOptional()
  @IsString()
  currency_code?: string;
}

/**
 * DTO phản hồi thông tin hóa đơn
 */
export class BillResponseDto extends BaseDto {
  @ApiProperty({
    description: 'Tiêu đề của hóa đơn',
    example: 'Hóa đơn ăn trưa',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Tổng số tiền của hóa đơn',
    example: 150000,
  })
  @Expose()
  total_amount: number;

  @ApiProperty({
    description: 'Tổng số tiền gốc của hóa đơn (trước khi có thay đổi)',
    example: 150000,
  })
  @Expose()
  original_total_amount: number;

  @ApiPropertyOptional({
    description: 'Ghi chú cho hóa đơn',
    example: 'Ăn trưa tại nhà hàng ABC',
  })
  @Expose()
  note?: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh của hóa đơn',
    example: 'https://example.com/bill-image.jpg',
  })
  @Expose()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Số tiền giảm giá',
    example: 15000,
  })
  discount?: number;

  @ApiPropertyOptional({
    description: 'Phần trăm giảm giá',
    example: 10,
  })
  @Expose()
  percent_discount?: number;

  @ApiProperty({
    description: 'Mã tiền tệ',
    example: 'VND',
  })
  @Expose()
  currency_code: string;
}
