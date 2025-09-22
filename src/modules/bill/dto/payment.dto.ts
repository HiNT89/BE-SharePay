import {
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
  IsPositive,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@/common';

/**
 * Enum cho phương thức thanh toán
 */
export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  E_WALLET = 'e_wallet',
  CREDIT_CARD = 'credit_card',
  OTHER = 'other',
}

/**
 * DTO để tạo mới một payment
 */
export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  billId: number;

  @ApiProperty({
    description: 'ID của người thanh toán',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  payerId: number;

  @ApiProperty({
    description: 'Số tiền thanh toán',
    example: 25000,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'bank_transfer',
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod = PaymentMethod.CASH;

  @ApiPropertyOptional({
    description: 'Ghi chú về khoản thanh toán',
    example: 'Chuyển khoản qua VietcomBank',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: 'URL chứng từ thanh toán (ảnh chụp, screenshot...)',
    example: 'https://example.com/payment-proof.jpg',
  })
  @IsOptional()
  @IsUrl()
  proof_url?: string;

  @ApiPropertyOptional({
    description: 'Thời gian thanh toán (ISO string)',
    example: '2024-01-01T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  paid_at?: string;
}

/**
 * DTO để cập nhật thông tin payment
 */
export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: 'Số tiền thanh toán',
    example: 25000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Phương thức thanh toán',
    example: 'bank_transfer',
    enum: PaymentMethod,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Ghi chú về khoản thanh toán',
    example: 'Chuyển khoản qua VietcomBank',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: 'URL chứng từ thanh toán (ảnh chụp, screenshot...)',
    example: 'https://example.com/payment-proof.jpg',
  })
  @IsOptional()
  @IsUrl()
  proof_url?: string;

  @ApiPropertyOptional({
    description: 'Thời gian thanh toán (ISO string)',
    example: '2024-01-01T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  paid_at?: string;
}

/**
 * DTO phản hồi thông tin payment
 */
export class PaymentResponseDto extends BaseDto {
  @ApiProperty({
    description: 'ID của hóa đơn',
    example: 1,
  })
  billId: number;

  @ApiProperty({
    description: 'ID của người thanh toán',
    example: 1,
  })
  payerId: number;

  @ApiProperty({
    description: 'Số tiền thanh toán',
    example: 25000,
    type: 'number',
  })
  amount: number;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'bank_transfer',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Ghi chú về khoản thanh toán',
    example: 'Chuyển khoản qua VietcomBank',
  })
  note?: string;

  @ApiPropertyOptional({
    description: 'URL chứng từ thanh toán',
    example: 'https://example.com/payment-proof.jpg',
  })
  proof_url?: string;

  @ApiProperty({
    description: 'Thời gian thanh toán',
    example: '2024-01-01T12:00:00Z',
  })
  paid_at: Date;
}
