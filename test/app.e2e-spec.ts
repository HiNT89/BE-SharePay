// Import testing utilities từ NestJS
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

// Import supertest để test HTTP requests
import * as request from 'supertest';
import { App } from 'supertest/types';

// Import root module của ứng dụng
import { AppModule } from './../src/app.module';

/**
 * End-to-End (E2E) tests cho AppController
 *
 * Mục tiêu:
 * - Test toàn bộ HTTP pipeline từ request đến response
 * - Verify integration giữa các components
 * - Test như một client thực sự gọi API
 * - Không mock dependencies - test với real implementations
 */
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  /**
   * Setup trước mỗi test case
   * Tạo một NestJS application instance hoàn chỉnh
   */
  beforeEach(async () => {
    // Tạo testing module với toàn bộ AppModule
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import toàn bộ ứng dụng
    }).compile();

    // Tạo NestJS application instance
    app = moduleFixture.createNestApplication();

    // Khởi tạo application (giống như trong main.ts)
    await app.init();
  });

  /**
   * Test case: GET / endpoint
   *
   * Verify:
   * - HTTP status code = 200
   * - Response body = "Hello World!"
   */
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/') // Gửi GET request tới /
      .expect(200) // Expect HTTP 200 OK
      .expect('Hello World!'); // Expect response body
  });
});
