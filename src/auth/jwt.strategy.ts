// Import các decorator và exception từ NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Import PassportStrategy để tạo custom strategy
import { PassportStrategy } from '@nestjs/passport';

// Import JWT strategy và utility từ passport-jwt
import { ExtractJwt, Strategy } from 'passport-jwt';

// Import ConfigService để lấy environment variables
import { ConfigService } from '@nestjs/config';

// Import UserService để validate user từ database
import { UserService } from '../user/user.service';

/**
 * JWT Strategy - Xử lý authentication với JWT token
 *
 * Chức năng:
 * - Verify JWT token trong header Authorization
 * - Extract payload từ token đã verify
 * - Validate user tồn tại và đang hoạt động
 * - Attach user object vào request để sử dụng trong các endpoint
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor - Cấu hình JWT strategy
   */
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      // Extract JWT token từ Authorization header với format "Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Không ignore expiration - token hết hạn sẽ bị reject
      ignoreExpiration: false,

      // Secret key để verify token (từ environment variable)
      secretOrKey: configService.get('JWT_SECRET') || 'fallback-secret',
    });
  }

  /**
   * Validate JWT payload và user
   *
   * Method này được gọi tự động sau khi JWT token được verify thành công
   *
   * @param payload - JWT payload chứa thông tin user (sub: userId, email)
   * @returns User object nếu valid, throw exception nếu invalid
   * @throws UnauthorizedException - Nếu user không tồn tại hoặc bị vô hiệu hóa
   */
  async validate(payload: any) {
    // Lấy user từ database theo ID trong payload (sub = subject = user ID)
    const user = await this.userService.findById(payload.sub);

    // Kiểm tra user tồn tại và đang hoạt động
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc đã bị vô hiệu hóa',
      );
    }

    // Return user object sẽ được attach vào request.user
    return user;
  }
}
