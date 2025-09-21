import { IsString, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/base/base.response.dto';
import { UserResponseDto } from '@/modules/user/dto/user.dto';

/**
 * DTO để tạo bản ghi thanh toán mới
 * Ghi nhận việc một người dùng thanh toán cho một phần của item trong hóa đơn
 */
export class CreatePaidDto {
  @ApiProperty({
    description: 'Số tiền đã thanh toán (VND)',
    example: 25000,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Tỷ lệ phần trăm thanh toán cho item này (0-100%)',
    example: 50.0,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  percent: number;

  @ApiProperty({
    description: 'ID của người dùng thực hiện thanh toán',
    example: 1,
    type: Number,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'ID của item trong hóa đơn được thanh toán',
    example: 1,
    type: Number,
  })
  @IsNumber()
  bill_item_id: number;
}

/**
 * DTO để cập nhật thông tin thanh toán
 * Cho phép thay đổi số tiền, tỷ lệ hoặc chuyển sang người/item khác
 */
export class UpdatePaidDto {
  @ApiProperty({
    description: 'Số tiền thanh toán mới (VND)',
    example: 30000,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Tỷ lệ phần trăm thanh toán mới (0-100%)',
    example: 60.0,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  percent: number;

  @ApiProperty({
    description:
      'ID người dùng thực hiện thanh toán (có thể chuyển sang người khác)',
    example: 2,
    type: Number,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'ID item được thanh toán (có thể chuyển sang item khác)',
    example: 1,
    type: Number,
  })
  @IsNumber()
  bill_item_id: number;
}

/**
 * DTO response cho thông tin thanh toán
 * Bao gồm thông tin chi tiết về bản ghi thanh toán và người thực hiện
 */
export class PaidResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Số tiền đã thanh toán',
    example: 25000,
    type: Number,
  })
  @Expose()
  amount: number;

  @ApiProperty({
    description: 'Tỷ lệ phần trăm thanh toán cho item',
    example: 50.0,
    type: Number,
  })
  @Expose()
  percent: number;

  @ApiProperty({
    description: 'ID của người dùng thực hiện thanh toán',
    example: 1,
  })
  @Expose()
  user_id: number;

  @ApiProperty({
    description: 'Thông tin người dùng thực hiện thanh toán',
    type: () => UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({
    description: 'ID của item trong hóa đơn được thanh toán',
    example: 1,
  })
  @Expose()
  bill_item_id: number;
}
