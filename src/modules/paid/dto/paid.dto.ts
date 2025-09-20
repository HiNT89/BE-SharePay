import { IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from '@/common/base/base.response.dto';

export class CreatePaidDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  percent: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  bill_item_id: number;
}

export class UpdatePaidDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  percent: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  bill_item_id: number;
}

export class PaidResponseDto extends BaseResponseDto {
  @Expose()
  amount: number;

  @Expose()
  percent: number;

  @Expose()
  user_id: number;

  @Expose()
  bill_item_id: number;
}
