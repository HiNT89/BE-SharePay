import { IsString, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@/common/base/base.response.dto';
import { PaidResponseDto } from '@/modules/paid/dto/paid.dto';

/**
 * DTO để tạo item mới trong hóa đơn
 * Mỗi item đại diện cho một món/sản phẩm trong hóa đơn chia sẻ
 */
export class CreateBillItemDto {
  @ApiProperty({
    description: 'Tên của item/món ăn/sản phẩm',
    example: 'Cơm gà',
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Giá của một đơn vị item (VND)',
    example: 50000,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Số lượng của item',
    example: 2,
    type: Number,
    minimum: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'ID của hóa đơn chứa item này',
    example: 1,
    type: Number,
  })
  @IsNumber()
  bill_id: number;
}

/**
 * DTO để cập nhật thông tin item trong hóa đơn
 * Cho phép thay đổi tên, giá, số lượng và chuyển item sang hóa đơn khác
 */
export class UpdateBillItemDto {
  @ApiProperty({
    description: 'Tên mới của item',
    example: 'Cơm gà nướng',
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Giá mới của một đơn vị item (VND)',
    example: 55000,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Số lượng mới của item',
    example: 3,
    type: Number,
    minimum: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'ID hóa đơn chứa item (có thể chuyển sang hóa đơn khác)',
    example: 1,
    type: Number,
  })
  @IsNumber()
  bill_id: number;
}

/**
 * DTO response cho thông tin item trong hóa đơn
 * Bao gồm thông tin item và danh sách thanh toán liên quan
 */
export class BillItemResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Tên của item/món ăn/sản phẩm',
    example: 'Cơm gà',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Giá của một đơn vị item',
    example: 50000,
    type: Number,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Số lượng của item',
    example: 2,
    type: Number,
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'ID của hóa đơn chứa item này',
    example: 1,
  })
  @Expose()
  bill_id: number;

  @ApiProperty({
    description: 'Danh sách các bản ghi thanh toán cho item này',
    type: () => [PaidResponseDto],
    isArray: true,
  })
  @Expose()
  @Type(() => PaidResponseDto)
  paidList: PaidResponseDto[];
}
