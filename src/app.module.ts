// Import decorator Module từ NestJS
import { Module } from '@nestjs/common';

// Import Config module để đọc environment variables
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import TypeORM module để kết nối database
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { PaidModule } from './modules/paid/paid.module';
import { BillItemModule } from './modules/bill-item/bill-item.module';
import { BillModule } from './modules/bill/bill.module';

// Import các feature modules

/**
 * App Module - Root module của ứng dụng NestJS
 *
 * Chức năng:
 * - Cấu hình các module con (UserModule, AuthModule)
 * - Thiết lập database connection với TypeORM
 * - Cấu hình environment variables với ConfigModule
 * - Cung cấp AppController và AppService
 */
@Module({
  imports: [
    /**
     * Cấu hình ConfigModule global
     * Cho phép đọc environment variables (.env file) từ mọi nơi trong ứng dụng
     */
    ConfigModule.forRoot({
      isGlobal: true, // Module có thể được sử dụng globally mà không cần import
    }),

    /**
     * Cấu hình TypeORM với async configuration
     * Kết nối PostgreSQL database với thông tin từ environment variables
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule để sử dụng ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Database type
        host: configService.get('DB_HOST'), // Database host
        port: +(configService.get<number>('DB_PORT') ?? 5432), // Database port (convert to number)
        username: configService.get('DB_USERNAME'), // Database username
        password: configService.get('DB_PASSWORD'), // Database password
        database: configService.get('DB_NAME'), // Database name

        // Tự động load tất cả entities từ các file .entity.ts/.js
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        // Tự động sync database schema (chỉ dùng trong development)
        synchronize: configService.get('NODE_ENV') !== 'production',

        // Enable SQL logging trong development mode
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService], // Inject ConfigService vào factory function
    }),

    // Import các feature modules
    UserModule,
    PaidModule,
    BillItemModule,
    BillModule,
  ],
})
export class AppModule {}
