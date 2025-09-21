import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ResponseStatus, ResponseCode } from '../config/response.config';

/**
 * DTO cho phân trang và tìm kiếm
 * Được sử dụng chung cho tất cả các API có hỗ trợ phân trang
 *
 * Các tính năng:
 * - Phân trang với page và limit
 * - Sắp xếp theo field và thứ tự
 * - Tìm kiếm với từ khóa
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi trên mỗi trang',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Trường dữ liệu để sắp xếp',
    example: 'createdAt',
    default: 'id',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm',
    example: 'cơm gà',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

/**
 * Interface cho metadata của phân trang
 * Chứa thông tin về trang hiện tại, tổng số trang, v.v.
 */
export interface PaginationMeta {
  /** Trang hiện tại */
  page: number;
  /** Số lượng bản ghi trên mỗi trang */
  limit: number;
  /** Tổng số bản ghi */
  total: number;
  /** Tổng số trang */
  totalPages: number;
  /** Có trang tiếp theo hay không */
  hasNextPage: boolean;
  /** Có trang trước hay không */
  hasPrevPage: boolean;
  /** Trường sắp xếp */
  sortBy?: string;
  /** Thứ tự sắp xếp */
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Base Response DTO Class
 * Class cơ sở cho tất cả API responses trong hệ thống
 *
 * Cung cấp:
 * - Format response nhất quán
 * - Static methods để tạo response thành công/lỗi
 * - Hỗ trợ phân trang
 * - Metadata và timestamp
 */
export class BaseResponseDto<T> {
  @ApiProperty({
    description: 'Trạng thái của response',
    enum: ResponseStatus,
    example: ResponseStatus.SUCCESS,
  })
  status: ResponseStatus;

  @ApiProperty({
    description: 'Mã code của response',
    enum: ResponseCode,
    example: ResponseCode.OK,
  })
  code: ResponseCode;

  @ApiProperty({
    description: 'Thông báo mô tả kết quả',
    example: 'Thao tác thành công',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Dữ liệu trả về (nếu có)',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Metadata cho phân trang (nếu có)',
  })
  meta?: PaginationMeta;

  @ApiProperty({
    description: 'Timestamp khi tạo response',
    example: '2024-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Danh sách lỗi chi tiết (nếu có)',
    type: [Object],
  })
  errors?: any[];

  constructor(
    status: ResponseStatus,
    code: ResponseCode,
    message: string,
    data?: T,
    meta?: PaginationMeta,
    errors?: any[],
  ) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
    this.errors = errors;
  }

  /**
   * Tạo response thành công
   * @param data Dữ liệu trả về
   * @param message Thông báo thành công
   * @param code Mã response code
   * @param meta Metadata phân trang
   * @returns BaseResponseDto với trạng thái success
   */
  static success<T>(
    data?: T,
    message: string = 'Operation successful',
    code: ResponseCode = ResponseCode.OK,
    meta?: PaginationMeta,
  ): BaseResponseDto<T> {
    return new BaseResponseDto(
      ResponseStatus.SUCCESS,
      code,
      message,
      data,
      meta,
    );
  }

  /**
   * Tạo response lỗi
   * @param message Thông báo lỗi
   * @param code Mã lỗi
   * @param errors Chi tiết lỗi
   * @returns BaseResponseDto với trạng thái error
   */
  static error<T = any>(
    message: string = 'Operation failed',
    code: ResponseCode = ResponseCode.INTERNAL_SERVER_ERROR,
    errors?: any[],
  ): BaseResponseDto<T | null> {
    return new BaseResponseDto(
      ResponseStatus.ERROR,
      code,
      message,
      null,
      undefined,
      errors,
    );
  }

  /**
   * Tạo response có phân trang
   * @param data Danh sách dữ liệu
   * @param pagination Thông tin phân trang
   * @param total Tổng số bản ghi
   * @param message Thông báo thành công
   * @returns BaseResponseDto với metadata phân trang
   */
  static paginated<T>(
    data: T[],
    pagination: PaginationDto,
    total: number,
    message: string = 'Data retrieved successfully',
  ): BaseResponseDto<T[]> {
    const { page = 1, limit = 10, sortBy, sortOrder } = pagination;
    const totalPages = Math.ceil(total / limit);

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      sortBy,
      sortOrder,
    };

    return new BaseResponseDto(
      ResponseStatus.SUCCESS,
      ResponseCode.OK,
      message,
      data,
      meta,
    );
  }
}
