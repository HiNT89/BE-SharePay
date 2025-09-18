import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, IsInt, Min, Max } from 'class-validator';

/**
 * DTO cho pagination query parameters
 * Sử dụng cho các endpoint cần phân trang
 */
export class PaginationQueryDto {
  @ApiProperty({
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @IsPositive({ message: 'Số trang phải lớn hơn 0' })
  page?: number = 1;

  @ApiProperty({
    description: 'Số items per page (tối đa 100)',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải ít nhất là 1' })
  @Max(100, { message: 'Limit không được vượt quá 100' })
  limit?: number = 10;

  @ApiProperty({
    description: 'Sắp xếp theo field (ví dụ: createdAt)',
    example: 'createdAt',
    required: false,
  })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Thứ tự sắp xếp',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  /**
   * Calculate offset for database queries
   */
  get offset(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10);
  }
}
