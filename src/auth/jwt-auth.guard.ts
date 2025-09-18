// Import decorator Injectable từ NestJS
import { Injectable } from '@nestjs/common';

// Import AuthGuard từ NestJS Passport
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 *
 * Chức năng:
 * - Bảo vệ các endpoint yêu cầu authentication
 * - Sử dụng JwtStrategy để verify JWT token
 * - Tự động attach user object vào request sau khi verify thành công
 *
 * Cách sử dụng:
 * @UseGuards(JwtAuthGuard)
 *
 * Khi apply guard này:
 * 1. Kiểm tra Authorization header có chứa Bearer token
 * 2. Verify token với JWT secret
 * 3. Gọi JwtStrategy.validate() để check user
 * 4. Attach user vào request.user nếu thành công
 * 5. Trả về 401 Unauthorized nếu thất bại
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
