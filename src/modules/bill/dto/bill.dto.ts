import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from '@/common/base/base.response.dto';
import { Optional } from '@nestjs/common';

export class CreateBillDto {
  @IsNumber()
  userCreateId: number;

  @IsNumber()
  total_amount: number;

  @IsString()
  title: string;

  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateBillDto {
  @IsNumber()
  userCreateId: number;

  @IsNumber()
  total_amount: number;

  @IsString()
  title: string;

  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class BillResponseDto extends BaseResponseDto {
  @IsString()
  note: string;

  @Expose()
  total_amount: number;

  @Expose()
  title: string;

  @Expose()
  userCreateId: number;

  @Expose()
  imageUrl: string;
}
