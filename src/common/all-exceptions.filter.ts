// Import các interface và decorator cần thiết từ NestJS
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

/**
 * Global Exception Filter - Xử lý tất cả exceptions trong ứng dụng
 *
 * Chức năng:
 * - Catch tất cả exceptions (HttpException và các Error khác)
 * - Format response error nhất quán cho client
 * - Log chi tiết error để debug
 * - Che giấu sensitive information trong production
 *
 * Được áp dụng globally trong main.ts
 */
@Catch() // Catch tất cả exceptions (không chỉ định loại cụ thể)
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Logger instance để ghi log errors
   */
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Method chính để xử lý exceptions
   *
   * @param exception - Exception được throw (có thể là HttpException, Error, hoặc unknown)
   * @param host - ArgumentsHost chứa context của request/response
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Get HTTP context từ ArgumentsHost
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Khởi tạo default values cho error response
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    /**
     * Xử lý HttpException (các exception được throw bởi NestJS/user code)
     * Ví dụ: NotFoundException, BadRequestException, UnauthorizedException, etc.
     */
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Exception response có thể là string hoặc object
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // Lấy message từ response object (thường có structure: {message, error, statusCode})
        message = (exceptionResponse as any).message || exception.message;
      }
    } else if (exception instanceof Error) {
    /**
     * Xử lý các Error khác (system errors, database errors, etc.)
     */
      message = exception.message;
    }

    /**
     * Log error với thông tin chi tiết để debug
     * Bao gồm HTTP method, URL, và stack trace nếu có
     */
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    /**
     * Trả về standardized error response cho client
     *
     * Response format:
     * {
     *   statusCode: number,
     *   timestamp: string (ISO),
     *   path: string,
     *   message: string
     * }
     */
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
