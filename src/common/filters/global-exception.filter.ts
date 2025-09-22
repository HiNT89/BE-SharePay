import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponseDto } from '@/common/base/base.response.dto';
import { ResponseCode, RESPONSE_MESSAGES } from '../config/response.config';

/**
 * Bộ lọc ngoại lệ toàn cục để bắt tất cả các ngoại lệ chưa được xử lý trong ứng dụng
 * và chuyển đổi chúng thành định dạng phản hồi chuẩn hóa.
 *
 * Bộ lọc này chặn các ngoại lệ được ném ra trong toàn bộ ứng dụng và:
 * - Ánh xạ các ngoại lệ HTTP thành các mã phản hồi phù hợp
 * - Xử lý lỗi xác thực và các loại ngoại lệ cụ thể khác
 * - Trả về định dạng lỗi BaseResponseDto nhất quán
 * - Cung cấp phương án dự phòng cho các lỗi không mong muốn
 *
 * @implements {ExceptionFilter}
 *
 * @example
 * ```typescript
 * // Sử dụng trong main.ts hoặc module
 * app.useGlobalFilters(new GlobalExceptionFilter());
 * ```
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = RESPONSE_MESSAGES.INTERNAL_ERROR;
    let code = ResponseCode.INTERNAL_SERVER_ERROR;
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        'data' in (exceptionResponse as any)
      ) {
        // If it's already a BaseResponseDto structure, use it
        return response.status(status).json(exceptionResponse);
      }

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors || [];
      }

      // Map HTTP status to our ResponseCode
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          code = ResponseCode.BAD_REQUEST;
          break;
        case HttpStatus.UNAUTHORIZED:
          code = ResponseCode.UNAUTHORIZED;
          break;
        case HttpStatus.FORBIDDEN:
          code = ResponseCode.FORBIDDEN;
          break;
        case HttpStatus.NOT_FOUND:
          code = ResponseCode.NOT_FOUND;
          break;
        case HttpStatus.CONFLICT:
          code = ResponseCode.CONFLICT;
          break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          code = ResponseCode.VALIDATION_ERROR;
          break;
        default:
          code = ResponseCode.INTERNAL_SERVER_ERROR;
      }
    }

    const errorResponse = BaseResponseDto.error(message, code, errors);

    response.status(status).json(errorResponse);
  }
}
