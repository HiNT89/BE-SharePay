import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../base/base.common.dto';

/**
 * Interceptor phản hồi chuẩn hóa tất cả HTTP responses bằng cách bọc chúng trong BaseResponseDto.
 *
 * Interceptor này đảm bảo định dạng phản hồi nhất quán trong toàn bộ ứng dụng bằng cách:
 * - Kiểm tra xem dữ liệu phản hồi đã được bọc trong BaseResponseDto chưa
 * - Nếu chưa được bọc, tự động bọc dữ liệu thô bằng BaseResponseDto.success()
 * - Giữ nguyên các phản hồi BaseResponseDto đã được định dạng sẵn
 *
 * @template T Kiểu dữ liệu của phản hồi đang được intercepted
 *
 * @example
 * ```typescript
 * // Controller trả về dữ liệu thô
 * return { id: 1, name: 'John' };
 *
 * // Interceptor chuyển đổi thành:
 * {
 *   success: true,
 *   data: { id: 1, name: 'John' },
 *   message: 'Success'
 * }
 * ```
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, BaseResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already a BaseResponseDto, return as is
        if (data instanceof BaseResponseDto) {
          return data;
        }

        // Wrap plain data in BaseResponseDto
        return BaseResponseDto.success(data);
      }),
    );
  }
}
