import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO (Data Transfer Object) cho việc tạo hóa đơn mới
 *
 * Chức năng:
 * - Định nghĩa cấu trúc dữ liệu đầu vào cho API tạo bill
 * - Validate dữ liệu với class-validator
 * - Tạo Swagger documentation tự động
 */
export class CreateBillDto {
  /**
   * tiêu đề của hóa đơn
   */
  @ApiProperty({
    description: 'Tiêu đề của hóa đơn',
    example: 'Hóa đơn tháng 9',
  })
  @IsString({ message: 'Tiêu đề không hợp lệ' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  /**
   * Tông số tiền của hóa đơn
   */
  @ApiProperty({
    description: 'Tổng số tiền của hóa đơn',
    example: 1000000,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Tổng số tiền không được để trống' })
  total_amount: number;

  /**
   * Ghi chú thêm về hóa đơn (nếu có)
   */
  @ApiProperty({
    description: 'Ghi chú thêm về hóa đơn (nếu có)',
    example: 'Ghi chú về hóa đơn',
  })
  @IsString({ message: 'Ghi chú không hợp lệ' })
  note: string;

  /**
   * Hình ảnh hóa đơn (nếu có)
   */
  @ApiProperty({
    description: 'Hình ảnh hóa đơn (nếu có)',
    example: 'https://example.com/image.jpg',
  })
  @IsString({})
  image_url: string;

  /**
   * Ngày phát sinh hóa đơn (nếu có)
   */
  @ApiProperty({
    description: 'Ngày phát sinh hóa đơn (nếu có)',
    example: '2023-09-15',
  })
  @IsDate({})
  bill_date?: Date;

  /**
   * User ID của người tạo hóa đơn (bắt buộc)
   */
  @ApiProperty({
    description: 'User ID của người tạo hóa đơn (bắt buộc)',
    example: 1,
  })
  @IsNumber({})
  user_id: number;
}
