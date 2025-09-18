// Import decorator Module từ NestJS
import { Module } from '@nestjs/common';

// Import JWT module để tạo và verify JWT tokens
import { JwtModule } from '@nestjs/jwt';

// Import Passport module để sử dụng authentication strategies
import { PassportModule } from '@nestjs/passport';

// Import Config module để đọc environment variables
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import các components của Auth module
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// Import UserModule để sử dụng UserService
import { UserModule } from '../user/user.module';

// Import các authentication strategies
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

/**
 * Auth Module - Module quản lý authentication và authorization
 *
 * Chức năng:
 * - Cấu hình JWT token generation và verification
 * - Đăng ký các Passport strategies (JWT, Local)
 * - Cung cấp AuthController và AuthService
 * - Import UserModule để sử dụng UserService
 */
@Module({
  imports: [
    // Import UserModule để AuthService có thể sử dụng UserService
    UserModule,

    // Import PassportModule để sử dụng các authentication strategies
    PassportModule,

    // Cấu hình JWT module với async configuration
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule để đọc environment variables
      useFactory: async (configService: ConfigService) => ({
        // JWT secret key từ environment variable
        secret: configService.get('JWT_SECRET') || 'fallback-secret',
        signOptions: {
          // Thời gian hết hạn token từ environment variable
          expiresIn: configService.get('JWT_EXPIRATION') || '24h',
        },
      }),
      inject: [ConfigService], // Inject ConfigService vào factory function
    }),
  ],
  controllers: [AuthController], // Controller để handle authentication endpoints
  providers: [
    AuthService, // Service chứa business logic cho authentication
    JwtStrategy, // Strategy để verify JWT tokens
    LocalStrategy, // Strategy để authenticate với email/password
  ],
  exports: [AuthService], // Export AuthService để các module khác có thể sử dụng
})
export class AuthModule {}
