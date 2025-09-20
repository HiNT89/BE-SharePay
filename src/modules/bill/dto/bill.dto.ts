import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto } from '@/common/base/base.response.dto';
import { UserResponseDto } from '@/modules/user/dto/user.dto';

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
  @Expose()
  title: string;

  @Expose()
  currency_code: string;

  @Expose()
  total_amount: number;

  @Expose()
  note: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto; // Sửa từ userCreate thành user để khớp với entity

  @Expose()
  userCreateId: number;
}
