// Import exception từ NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Import JWT service để tạo và verify token
import { JwtService } from '@nestjs/jwt';

// Import UserService để tương tác với user data
import { UserService } from '../user/user.service';

// Import entity và DTOs
import { User } from '../user/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '@/modules/user/dto/user-response.dto';

// Import response helpers
import {
  BaseResponseDto,
  ResponseHelper,
} from '@/common/dto/base-response.dto';

// Import class-transformer
import { plainToClass } from 'class-transformer';

/**
 * Service xử lý authentication và authorization
 *
 * Chức năng chính:
 * - Đăng nhập (login) với email/password
 * - Đăng ký (register) tài khoản mới
 * - Validate thông tin đăng nhập
 * - Tạo JWT token
 * - Lấy thông tin profile người dùng
 */
@Injectable()
export class AuthService {
  /**
   * Constructor - Inject dependencies
   */
  constructor(
    private userService: UserService, // Service để tương tác với user data
    private jwtService: JwtService, // Service để tạo và verify JWT token
  ) {}

  /**
   * Validate thông tin đăng nhập của người dùng
   *
   * @param email - Email của người dùng
   * @param password - Password thô (chưa hash)
   * @returns User entity nếu thông tin đúng, null nếu sai
   *
   * Sử dụng bởi LocalStrategy để xác thực
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    // Tìm user theo email
    const user = await this.userService.findByEmail(email);

    // Kiểm tra user tồn tại và password đúng
    if (user && (await user.validatePassword(password))) {
      return user;
    }

    return null;
  }

  /**
   * Đăng nhập người dùng
   *
   * @param loginDto - Thông tin đăng nhập (email, password)
   * @returns BaseResponseDto<AuthResponseDto> - Chứa access token và thông tin user có metadata
   * @throws UnauthorizedException - Nếu thông tin đăng nhập sai hoặc tài khoản bị vô hiệu hóa
   */
  async login(loginDto: LoginDto): Promise<BaseResponseDto<AuthResponseDto>> {
    // Validate thông tin đăng nhập
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Kiểm tra tài khoản có đang hoạt động không
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    // Tạo JWT payload với thông tin cần thiết
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // Tính thời gian hết hạn (24h từ bây giờ)
    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours in seconds

    // Chuyển đổi user entity sang DTO response (loại bỏ password)
    const userResponse = plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    const authResponse: AuthResponseDto = {
      accessToken,
      // user: userResponse,
      expiresAt,
      tokenType: 'Bearer',
      loginTime: new Date().toISOString(),
    };

    return ResponseHelper.success(authResponse, 'Đăng nhập thành công');
  }

  /**
   * Đăng ký tài khoản mới
   *
   * @param registerDto - Thông tin đăng ký (email, password, firstName, lastName)
   * @returns BaseResponseDto<AuthResponseDto> - Chứa access token và thông tin user mới tạo có metadata
   * @throws ConflictException - Nếu email đã tồn tại (từ UserService)
   */
  async register(
    registerDto: RegisterDto,
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    // Tạo user mới thông qua UserService (sử dụng method đơn giản)
    const user = await this.userService.createSimple(registerDto);

    // Tạo JWT token ngay sau khi đăng ký thành công
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // Tính thời gian hết hạn (24h từ bây giờ)
    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours in seconds

    const authResponse: AuthResponseDto = {
      accessToken,

      expiresAt,
      tokenType: 'Bearer',
      loginTime: new Date().toISOString(),
    };

    return ResponseHelper.success(authResponse, 'Đăng ký thành công', 201);
  }

  /**
   * Lấy thông tin profile của người dùng hiện tại
   *
   * @param userId - ID của người dùng (từ JWT token)
   * @returns BaseResponseDto<UserResponseDto> - Thông tin chi tiết người dùng có metadata
   * @throws NotFoundException - Nếu không tìm thấy user (từ UserService)
   */
  async getProfile(userId: number): Promise<BaseResponseDto<UserResponseDto>> {
    return this.userService.findOne(userId);
  }
}
