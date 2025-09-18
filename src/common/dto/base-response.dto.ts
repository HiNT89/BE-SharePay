import { ApiProperty } from '@nestjs/swagger';

/**
 * Interface định nghĩa metadata cho pagination
 */
export interface PaginationMeta {
  /** Trang hiện tại */
  currentPage: number;
  /** Số items per page */
  itemsPerPage: number;
  /** Tổng số items */
  totalItems: number;
  /** Tổng số trang */
  totalPages: number;
  /** Có trang tiếp theo không */
  hasNextPage: boolean;
  /** Có trang trước không */
  hasPreviousPage: boolean;
}

/**
 * Interface định nghĩa metadata cơ bản
 */
export interface BaseMeta {
  /** Timestamp của response */
  timestamp: string;
  /** Request ID để tracking */
  requestId?: string;
  /** API version */
  version: string;
  /** HTTP status code */
  statusCode: number;
  /** Message mô tả kết quả */
  message?: string;
}

/**
 * Base Response DTO chứa data và metadata
 * Sử dụng generic type để support nhiều loại data khác nhau
 */
export class BaseResponseDto<T> {
  @ApiProperty({
    description: 'Dữ liệu trả về',
  })
  data: T;

  @ApiProperty({
    description: 'Metadata của response',
    example: {
      timestamp: '2024-01-01T00:00:00.000Z',
      version: '1.0',
      statusCode: 200,
      message: 'Success',
    },
  })
  meta: BaseMeta;

  constructor(data: T, meta: BaseMeta) {
    this.data = data;
    this.meta = meta;
  }
}

/**
 * Interface kết hợp BaseMeta với Pagination
 */
export interface PaginatedMeta extends BaseMeta {
  pagination: PaginationMeta;
}

/**
 * Paginated Response DTO cho các endpoint có pagination
 */
export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  @ApiProperty({
    description: 'Metadata bao gồm thông tin pagination',
    example: {
      timestamp: '2024-01-01T00:00:00.000Z',
      version: '1.0',
      statusCode: 200,
      message: 'Success',
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    },
  })
  declare meta: PaginatedMeta;

  constructor(data: T[], meta: BaseMeta, pagination: PaginationMeta) {
    const paginatedMeta: PaginatedMeta = { ...meta, pagination };
    super(data, paginatedMeta);
  }
}

/**
 * Helper class để tạo standardized responses
 */
export class ResponseHelper {
  /**
   * Tạo success response với metadata cơ bản
   */
  static success<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
  ): BaseResponseDto<T> {
    const meta: BaseMeta = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      statusCode,
      message,
    };

    return new BaseResponseDto(data, meta);
  }

  /**
   * Tạo paginated response với metadata pagination
   */
  static paginated<T>(
    data: T[],
    currentPage: number,
    itemsPerPage: number,
    totalItems: number,
    message = 'Success',
    statusCode = 200,
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pagination: PaginationMeta = {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };

    const meta: BaseMeta = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      statusCode,
      message,
    };

    return new PaginatedResponseDto(data, meta, pagination);
  }

  /**
   * Tạo error response với metadata
   */
  static error(
    message: string,
    statusCode: number,
    details?: any,
  ): BaseResponseDto<null> {
    const meta: BaseMeta = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      statusCode,
      message,
    };

    return new BaseResponseDto(details || null, meta);
  }
}
