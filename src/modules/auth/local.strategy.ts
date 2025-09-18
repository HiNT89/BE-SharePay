// Import các decorator và exception từ NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Import PassportStrategy để tạo custom strategy
import { PassportStrategy } from '@nestjs/passport';

// Import Local strategy từ passport-local
import { Strategy } from 'passport-local';

// Import AuthService để validate user credentials
import { AuthService } from './auth.service';

/**
 * Local Strategy - Xử lý authentication với username/password
 *
 * Chức năng:
 * - Validate email và password từ request body
 * - Sử dụng AuthService để kiểm tra credentials
 * - Trả về user object nếu thông tin đúng
 *
 * Note: Strategy này có thể được sử dụng với LocalAuthGuard
 * nhưng trong project hiện tại, authentication được xử lý trực tiếp
 * trong AuthController.login() method
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor - Cấu hình Local strategy
   */
  constructor(private authService: AuthService) {
    super({
      // Sử dụng 'email' thay vì 'username' mặc định
      usernameField: 'email',
    });
  }

  /**
   * Validate user credentials
   *
   * @param email - Email của người dùng
   * @param password - Password thô (chưa hash)
   * @returns User object nếu credentials hợp lệ
   * @throws UnauthorizedException - Nếu email hoặc password sai
   */
  async validate(email: string, password: string): Promise<any> {
    // Sử dụng AuthService để validate credentials
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    return user;
  }
}
