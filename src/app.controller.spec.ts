// Import testing utilities từ NestJS
import { Test, TestingModule } from '@nestjs/testing';

// Import các components cần test
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Unit tests cho AppController
 *
 * Mục tiêu:
 * - Test các endpoints của AppController
 * - Verify business logic hoạt động đúng
 * - Mock dependencies (AppService) nếu cần
 */
describe('AppController', () => {
  let appController: AppController;

  /**
   * Setup trước mỗi test case
   * Tạo testing module với dependencies cần thiết
   */
  beforeEach(async () => {
    // Tạo testing module - giống như tạo NestJS module thật
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController], // Controller cần test
      providers: [AppService], // Dependencies của controller
    }).compile();

    // Get instance của AppController từ testing module
    appController = app.get<AppController>(AppController);
  });

  /**
   * Test group cho root endpoint
   */
  describe('root', () => {
    /**
     * Test case: Verify endpoint GET / trả về đúng message
     */
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
