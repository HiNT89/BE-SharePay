import {
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@/common';

/**
 * DTO để tạo mới một bill item
 */
export class CreateBillItemDto {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  billId: number;

  @ApiProperty({
    description: 'Tên sản phẩm/món ăn',
    example: 'Phở bò',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Đơn giá',
    example: 50000,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  unit_price: number;

  @ApiProperty({
    description: 'Số lượng',
    example: 2,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number = 1;

  @ApiPropertyOptional({
    description: 'Số tiền giảm giá',
    example: 5000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount?: number = 0;

  @ApiPropertyOptional({
    description: 'Phần trăm giảm giá',
    example: 10,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount_percent?: number = 0;

  @ApiPropertyOptional({
    description: 'Ghi chú cho item',
    example: 'Không hành',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

/**
 * DTO để cập nhật thông tin bill item
 */
export class UpdateBillItemDto {
  @ApiPropertyOptional({
    description: 'Tên sản phẩm/món ăn',
    example: 'Phở bò',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({
    description: 'Đơn giá',
    example: 50000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  unit_price?: number;

  @ApiPropertyOptional({
    description: 'Số lượng',
    example: 2,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Số tiền giảm giá',
    example: 5000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Phần trăm giảm giá',
    example: 10,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount_percent?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú cho item',
    example: 'Không hành',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

/**
 * DTO phản hồi thông tin bill item
 */
export class BillItemResponseDto extends BaseDto {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  billId: number;

  @ApiProperty({
    description: 'Tên sản phẩm/món ăn',
    example: 'Phở bò',
  })
  name: string;

  @ApiProperty({
    description: 'Đơn giá',
    example: 50000,
    type: 'number',
  })
  unit_price: number;

  @ApiProperty({
    description: 'Số lượng',
    example: 2,
    type: 'number',
  })
  quantity: number;

  @ApiProperty({
    description: 'Số tiền giảm giá',
    example: 5000,
    type: 'number',
  })
  discount: number;

  @ApiProperty({
    description: 'Phần trăm giảm giá',
    example: 10,
    type: 'number',
  })
  discount_percent: number;

  @ApiProperty({
    description: 'Tổng tiền của item',
    example: 95000,
    type: 'number',
  })
  total_amount: number;

  @ApiPropertyOptional({
    description: 'Ghi chú cho item',
    example: 'Không hành',
  })
  note?: string;
}
