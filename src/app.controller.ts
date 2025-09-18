// Import các decorator cần thiết từ NestJS
import { Controller, Get } from '@nestjs/common';

// Import AppService để xử lý business logic
import { AppService } from './app.service';

/**
 * App Controller - Root controller của ứng dụng
 *
 * Chức năng:
 * - Xử lý root endpoint (/)
 * - Cung cấp health check endpoint
 * - Thường dùng để kiểm tra ứng dụng có hoạt động không
 */
@Controller() // Không có prefix - handle root path
export class AppController {
  /**
   * Constructor - Inject AppService
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   *
   * @returns string - Welcome message
   *
   * HTTP Method: GET /
   * Response: 200 - Welcome message
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
