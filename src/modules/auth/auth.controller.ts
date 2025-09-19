// Import các decorator cần thiết từ NestJS
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

// Import các decorator cho Swagger documentation
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Import service và DTOs
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

// Import common DTOs cho response
import { BaseResponseDto } from '@/common/dto/base-response.dto';

// Import example DTOs cho Swagger
import { AuthResponseExampleDto } from '@/common/dto/swagger-examples.dto';

/**
 * Controller xử lý các API endpoints liên quan đến authentication
 *
 * Chức năng chính:
 * - Đăng nhập (login)
 * - Đăng ký (register)
 * - Lấy thông tin profile người dùng hiện tại
 */
@ApiTags('Authentication') // Nhóm các API endpoints trong Swagger UI
@Controller('auth') // Base route là /auth
export class AuthController {
  /**
   * Constructor - Inject AuthService để xử lý business logic
   */
  constructor(private readonly authService: AuthService) {}
  /**
   * API đăng nhập
   *
   * @param loginDto - Thông tin đăng nhập (email, password)
   * @returns BaseResponseDto<AuthResponseDto> - Chứa access token và thông tin user có metadata
   *
   * HTTP Method: POST /auth/login
   * Body: LoginDto
   * Response: 200 - BaseResponseDto<AuthResponseDto> | 401 - Unauthorized
   */
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập với email và mật khẩu',
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    type: AuthResponseExampleDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK) // Trả về HTTP 200 thay vì 201 cho login
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    return this.authService.login(loginDto);
  }
  /**
   * API đăng ký tài khoản mới
   *
   * @param registerDto - Thông tin đăng ký (email, password, firstName, lastName)
   * @returns BaseResponseDto<AuthResponseDto> - Chứa access token và thông tin user mới tạo có metadata
   *
   * HTTP Method: POST /auth/register
   * Body: RegisterDto
   * Response: 201 - BaseResponseDto<AuthResponseDto> | 409 - Email đã tồn tại
   */
  @ApiOperation({
    summary: 'Đăng ký tài khoản',
    description: 'Tạo tài khoản mới với thông tin cơ bản',
  })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    type: AuthResponseExampleDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email đã được sử dụng',
  })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    return this.authService.register(registerDto);
  }

  /**
   * API lấy thông tin profile người dùng hiện tại
   *
   * @param req - Request object chứa thông tin user từ JWT token
   * @returns BaseResponseDto<UserResponseDto> - Thông tin chi tiết người dùng có metadata
   *
   * HTTP Method: GET /auth/profile
   * Headers: Authorization: Bearer <token>
   * Response: 200 - BaseResponseDto<UserResponseDto> | 401 - Token không hợp lệ
   */
  @ApiOperation({
    summary: 'Lấy thông tin profile',
    description: 'Lấy thông tin người dùng hiện tại từ JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    type: 'any',
  })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc đã hết hạn',
  })
  @ApiBearerAuth() // Yêu cầu JWT token trong header
  @UseGuards(JwtAuthGuard) // Áp dụng JWT guard để verify token
  @Get('profile')
  async getProfile(@Request() req): Promise<BaseResponseDto<UserResponseDto>> {
    // req.user được set bởi JwtStrategy sau khi verify token thành công
    return this.authService.getProfile(req.user.id);
  }
}
