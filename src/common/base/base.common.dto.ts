import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ResponseStatus, ResponseCode } from '../config/response.config';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export class BaseResponseDto<T> {
  status: ResponseStatus;
  code: ResponseCode;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  timestamp: string;
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
