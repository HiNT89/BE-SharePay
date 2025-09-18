import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { randomUUID } from 'crypto';

/**
 * Response Interceptor - Tự động thêm metadata vào response
 *
 * Chức năng:
 * - Thêm request ID vào mỗi response để tracking
 * - Thêm response time để monitor performance
 * - Standardize response format nếu chưa có metadata
 * - Đảm bảo tất cả response đều có cấu trúc nhất quán
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Generate unique request ID if not exists
    const requestId = request.headers['x-request-id'] || randomUUID();

    // Set request ID header for response
    response.setHeader('X-Request-ID', requestId);

    return next.handle().pipe(
      map((data) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Set performance headers
        response.setHeader('X-Response-Time', `${responseTime}ms`);

        // Nếu data đã có cấu trúc metadata (BaseResponseDto/PaginatedResponseDto)
        if (data && typeof data === 'object' && data.meta) {
          // Thêm requestId và responseTime vào metadata hiện có
          return {
            ...data,
            meta: {
              ...data.meta,
              requestId,
              responseTime: `${responseTime}ms`,
            },
          };
        }

        // Nếu data chưa có metadata, wrap nó với standardized format
        if (data !== null && data !== undefined) {
          return {
            data,
            meta: {
              timestamp: new Date().toISOString(),
              requestId,
              version: '1.0',
              statusCode: response.statusCode,
              message: 'Success',
              responseTime: `${responseTime}ms`,
            },
          };
        }

        // Trường hợp data là null/undefined (như DELETE operations)
        return {
          data: null,
          meta: {
            timestamp: new Date().toISOString(),
            requestId,
            version: '1.0',
            statusCode: response.statusCode,
            message: 'Operation completed successfully',
            responseTime: `${responseTime}ms`,
          },
        };
      }),
    );
  }
}
