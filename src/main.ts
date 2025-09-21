// Import NestFactory để tạo NestJS application instance
import { NestFactory } from '@nestjs/core';

// Import ValidationPipe để validate request data tự động
import { ValidationPipe } from '@nestjs/common';

// Import Swagger modules để tạo API documentation
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Import root module của ứng dụng
import { AppModule } from './app.module';

// Import global exception filter để xử lý errors
// import { AllExceptionsFilter } from './common/all-exceptions.filter';

// Import response interceptor để thêm metadata
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';

/**
 * Bootstrap function - Khởi tạo và cấu hình NestJS application
 *
 * Chức năng chính:
 * - Tạo NestJS application instance
 * - Cấu hình global middlewares, pipes, filters
 * - Thiết lập CORS cho cross-origin requests
 * - Tạo Swagger documentation
 * - Start HTTP server
 */
async function bootstrap() {
  // Tạo NestJS application instance từ AppModule
  const app = await NestFactory.create(AppModule);

  /**
   * Áp dụng Global Exception Filter
   * Xử lý tất cả exceptions trong ứng dụng và format response nhất quán
   */
  // app.useGlobalFilters(new AllExceptionsFilter());

  /**
   * Áp dụng Global Response Interceptor
   * Tự động thêm metadata vào tất cả response
   */
  // app.useGlobalInterceptors(new ResponseInterceptor());

  /**
   * Áp dụng Global Validation Pipe
   * Tự động validate request data dựa trên DTOs với class-validator
   *
   * Options:
   * - whitelist: Chỉ cho phép properties được định nghĩa trong DTO
   * - forbidNonWhitelisted: Throw error nếu có properties không được phép
   * - transform: Tự động transform plain object thành DTO instance
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Cấu hình CORS (Cross-Origin Resource Sharing)
   * Cho phép frontend truy cập API từ các domain khác
   *
   * Options:
   * - origin: Danh sách các domain được phép truy cập
   * - credentials: Cho phép gửi cookies và authentication headers
   */
  app.enableCors({
    origin: ['http://localhost:3000'], // Frontend URLs
    credentials: true,
  });

  /**
   * Cấu hình Swagger API Documentation
   * Tạo interactive API docs với khả năng test trực tiếp
   */
  const config = new DocumentBuilder()
    .setTitle('SharePay API')
    .setDescription('API documentation cho ứng dụng SharePay - Chia sẻ chi phí')
    .setVersion('1.0')

    // Cấu hình Bearer Authentication cho JWT tokens
    .addBearerAuth(
      {
        description: 'JWT Authorization token',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token', // Reference name để sử dụng trong @ApiBearerAuth()
    )

    // Thêm các tags để nhóm endpoints trong Swagger UI
    .addTag('Authentication', 'Các API liên quan đến xác thực')
    .addTag('Users', 'Các API quản lý người dùng')
    .addTag('Bills', 'Các API quản lý hóa đơn chia sẻ chi phí')
    .addTag('Bill Items', 'Các API quản lý items trong hóa đơn')
    .addTag('Payments', 'Các API quản lý thanh toán')
    .build();

  // Tạo Swagger document từ cấu hình và metadata của ứng dụng
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI tại đường dẫn /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      // Lưu authorization token trong localStorage để tái sử dụng
      persistAuthorization: true,
    },
  });

  /**
   * Start HTTP server
   * Lấy port từ environment variable hoặc sử dụng default port 3000
   */
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Log thông tin server đã start thành công
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

// Gọi bootstrap function để khởi chạy ứng dụng
bootstrap();
