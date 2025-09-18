// Import decorator Injectable từ NestJS
import { Injectable } from '@nestjs/common';

/**
 * App Service - Root service của ứng dụng
 *
 * Chức năng:
 * - Cung cấp business logic cho AppController
 * - Xử lý health check và các operations cơ bản
 * - Có thể mở rộng để thêm các global utilities
 */
@Injectable()
export class AppService {
  /**
   * Trả về welcome message cho health check endpoint
   *
   * @returns string - Welcome message
   */
  getHello(): string {
    return 'Hello World!';
  }
}
