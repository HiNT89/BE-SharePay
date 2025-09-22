import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@/common';

/**
 * DTO để tạo mới một bill item payer
 */
export class CreateBillItemPayerDto {
  @ApiProperty({
    description: 'ID của bill item',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  billItemId: number;

  @ApiProperty({
    description: 'ID của người ứng tiền',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  payerId: number;

  @ApiProperty({
    description: 'Số tiền thực tế ứng trước',
    example: 50000,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({
    description: 'Phần trăm ứng trước (nếu tính theo %)',
    example: 50.0,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  percent?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú về việc ứng tiền',
    example: 'Ứng trước 50% tổng bill',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

/**
 * DTO để cập nhật thông tin bill item payer
 */
export class UpdateBillItemPayerDto {
  @ApiPropertyOptional({
    description: 'Số tiền thực tế ứng trước',
    example: 50000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Phần trăm ứng trước (nếu tính theo %)',
    example: 50.0,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  percent?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú về việc ứng tiền',
    example: 'Ứng trước 50% tổng bill',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

/**
 * DTO phản hồi thông tin bill item payer
 */
export class BillItemPayerResponseDto extends BaseDto {
  @ApiProperty({
    description: 'ID của bill item',
    example: 1,
  })
  billItemId: number;

  @ApiProperty({
    description: 'ID của người ứng tiền',
    example: 1,
  })
  payerId: number;

  @ApiProperty({
    description: 'Số tiền thực tế ứng trước',
    example: 50000,
    type: 'number',
  })
  amount: number;

  @ApiPropertyOptional({
    description: 'Phần trăm ứng trước (nếu tính theo %)',
    example: 50.0,
    type: 'number',
  })
  percent?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú về việc ứng tiền',
    example: 'Ứng trước 50% tổng bill',
  })
  note?: string;
}
