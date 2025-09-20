import { IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from '@/common/base/base.response.dto';

export class CreateBillItemDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  bill_id: number;
}

export class UpdateBillItemDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  bill_id: number;
}

export class BillItemResponseDto extends BaseResponseDto {
  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  bill_id: number;
}
