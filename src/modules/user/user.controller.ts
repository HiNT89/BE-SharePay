import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { BaseController } from '@/common/base/base.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { BaseResponseDto, PaginationDto } from '@/common/base/base.common.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';

/**
 * User Controller
 * Quản lý các API endpoints liên quan đến người dùng
 *
 * Chức năng chính:
 * - Lấy danh sách người dùng với phân trang
 * - Tạo người dùng mới
 * - Cập nhật thông tin người dùng
 * - Kế thừa các chức năng CRUD cơ bản từ BaseController
 */
@ApiTags('Users')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  /**
   * Lấy danh sách tất cả người dùng với phân trang
   * Hỗ trợ tìm kiếm và lọc dữ liệu
   */
  @ApiOperation({
    summary: 'Lấy danh sách người dùng',
    description:
      'Trả về danh sách tất cả người dùng trong hệ thống với khả năng phân trang, tìm kiếm và lọc.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng bản ghi trên mỗi trang',
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Từ khóa tìm kiếm (tìm trong tên và email)',
    example: 'nguyen',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công',
    schema: {
      example: {
        success: true,
        message: 'Thành công',
        data: [
          {
            id: 1,
            email: 'user@example.com',
            name: 'Nguyễn Văn A',
            role: 'user',
            avatarUrl: 'https://example.com/avatar.jpg',
            bankInfo: {
              bankName: 'Vietcombank',
              accountNumber: '1234567890',
              accountHolderName: 'Nguyen Van A',
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        meta: {
          total: 100,
          page: 1,
          limit: 10,
          totalPages: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi server nội bộ',
    schema: {
      example: {
        success: false,
        message: 'Đã xảy ra lỗi trong quá trình xử lý',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
  })
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<User[]>> {
    try {
      return await this.userService.findAll(paginationDto);
    } catch (error) {
      throw new HttpException(
        BaseResponseDto.error(
          error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
          ResponseCode.INTERNAL_SERVER_ERROR,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Tạo người dùng mới
   * Validate dữ liệu đầu vào và kiểm tra email trùng lặp
   */
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description:
      'Tạo một tài khoản người dùng mới trong hệ thống. Email phải là duy nhất.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Thông tin người dùng cần tạo',
    examples: {
      'user-example': {
        summary: 'Người dùng thông thường',
        value: {
          email: 'user@example.com',
          name: 'Nguyễn Văn A',
          password: 'password123',
          role: 'user',
          avatarUrl: 'https://example.com/avatar.jpg',
          bankInfo: {
            bankName: 'Vietcombank',
            accountNumber: '1234567890',
            accountHolderName: 'Nguyen Van A',
            bankCode: 'VCB',
          },
        },
      },
      'admin-example': {
        summary: 'Quản trị viên',
        value: {
          email: 'admin@example.com',
          name: 'Admin User',
          password: 'adminpass123',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo người dùng thành công',
    schema: {
      example: {
        success: true,
        message: 'Tạo thành công',
        data: {
          id: 1,
          email: 'user@example.com',
          name: 'Nguyễn Văn A',
          role: 'user',
          avatarUrl: 'https://example.com/avatar.jpg',
          bankInfo: {
            bankName: 'Vietcombank',
            accountNumber: '1234567890',
            accountHolderName: 'Nguyen Van A',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        code: 'CREATED',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ hoặc email đã tồn tại',
    schema: {
      example: {
        success: false,
        message: 'Email đã tồn tại trong hệ thống',
        code: 'BAD_REQUEST',
      },
    },
  })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseResponseDto<User | null>> {
    try {
      const data = await this.userService.createUser(createUserDto);
      return BaseResponseDto.success(
        data,
        RESPONSE_MESSAGES.CREATED_SUCCESS,
        ResponseCode.CREATED,
      );
    } catch (error) {
      throw new HttpException(
        BaseResponseDto.error(
          error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
          ResponseCode.BAD_REQUEST,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Cập nhật thông tin người dùng theo ID
   * Hỗ trợ partial update (chỉ cập nhật các field được gửi)
   */
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description:
      'Cập nhật thông tin của người dùng theo ID. Hỗ trợ cập nhật từng phần (partial update).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng cần cập nhật',
    example: '1',
    type: String,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Thông tin cần cập nhật',
    examples: {
      'update-profile': {
        summary: 'Cập nhật hồ sơ cá nhân',
        value: {
          name: 'Nguyễn Văn B',
          avatarUrl: 'https://example.com/new-avatar.jpg',
        },
      },
      'update-bank-info': {
        summary: 'Cập nhật thông tin ngân hàng',
        value: {
          bankInfo: {
            bankName: 'Techcombank',
            accountNumber: '9876543210',
            accountHolderName: 'Nguyen Van B',
            bankCode: 'TCB',
          },
        },
      },
      'change-role': {
        summary: 'Thay đổi vai trò (Admin only)',
        value: {
          role: 'moderator',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thông tin thành công',
    schema: {
      example: {
        success: true,
        message: 'Cập nhật thành công',
        data: {
          id: 1,
          email: 'user@example.com',
          name: 'Nguyễn Văn B',
          role: 'user',
          avatarUrl: 'https://example.com/new-avatar.jpg',
          bankInfo: {
            bankName: 'Techcombank',
            accountNumber: '9876543210',
            accountHolderName: 'Nguyen Van B',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
    schema: {
      example: {
        success: false,
        message: 'Dữ liệu không hợp lệ',
        code: 'BAD_REQUEST',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
    schema: {
      example: {
        success: false,
        message: 'Người dùng không tồn tại',
        code: 'NOT_FOUND',
      },
    },
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto<User | null>> {
    try {
      const data = await this.userService.updateUser(+id, updateUserDto);
      return BaseResponseDto.success(data, RESPONSE_MESSAGES.UPDATED_SUCCESS);
    } catch (error) {
      throw new HttpException(
        BaseResponseDto.error(
          error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
          ResponseCode.BAD_REQUEST,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
