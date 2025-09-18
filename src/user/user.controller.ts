// Import các decorator cần thiết từ NestJS
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';

// Import các decorator cho Swagger documentation
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

// Import service và các DTO
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

// Import common DTOs cho pagination và response
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../common/dto/base-response.dto';

// Import example DTOs cho Swagger
import {
  UserResponseExampleDto,
  UsersListResponseExampleDto,
} from '../common/dto/swagger-examples.dto';

/**
 * Controller xử lý các API endpoints liên quan đến quản lý người dùng
 *
 * Chức năng chính:
 * - Tạo mới người dùng
 * - Lấy danh sách người dùng
 * - Lấy thông tin chi tiết người dùng
 * - Cập nhật thông tin người dùng
 * - Xóa người dùng
 */
@ApiTags('Users') // Nhóm các API endpoints trong Swagger UI
@ApiBearerAuth() // Yêu cầu JWT token để truy cập
@Controller('users') // Định nghĩa base route là /users
export class UserController {
  /**
   * Constructor - Inject UserService để xử lý business logic
   */
  constructor(private readonly userService: UserService) {}

  /**
   * API tạo người dùng mới
   *
   * @param createUserDto - Dữ liệu tạo người dùng (email, password, name)
   * @returns BaseResponseDto<UserResponseDto> - Response có metadata
   *
   * HTTP Method: POST /users
   * Body: CreateUserDto
   * Response: 201 - BaseResponseDto<UserResponseDto> | 409 - Email đã tồn tại
   */
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo một tài khoản người dùng mới (chỉ admin)',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo người dùng thành công',
    type: UserResponseExampleDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email đã được sử dụng',
  })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    return this.userService.create(createUserDto);
  }

  /**
   * API lấy danh sách tất cả người dùng với pagination
   *
   * @param paginationQuery - Query parameters cho pagination
   * @returns PaginatedResponseDto<UserResponseDto> - Danh sách người dùng có pagination metadata
   *
   * HTTP Method: GET /users
   * Query: PaginationQueryDto
   * Response: 200 - PaginatedResponseDto<UserResponseDto>
   */
  @ApiOperation({
    summary: 'Lấy danh sách tất cả người dùng',
    description:
      'Lấy danh sách tất cả người dùng trong hệ thống với pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số items per page (tối đa 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sắp xếp theo field',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Thứ tự sắp xếp',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công',
    type: UsersListResponseExampleDto,
  })
  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.userService.findAll(paginationQuery);
  }

  /**
   * API lấy thông tin chi tiết của một người dùng
   *
   * @param id - UUID của người dùng cần lấy thông tin
   * @returns BaseResponseDto<UserResponseDto> - Thông tin chi tiết của người dùng có metadata
   *
   * HTTP Method: GET /users/:id
   * Params: id (UUID) - được validate bằng ParseUUIDPipe
   * Response: 200 - BaseResponseDto<UserResponseDto> | 404 - Không tìm thấy người dùng
   */
  @ApiOperation({
    summary: 'Lấy thông tin người dùng theo ID',
    description: 'Lấy thông tin chi tiết của một người dùng',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    type: UserResponseExampleDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string, // ParseUUIDPipe tự động validate format UUID
  ): Promise<BaseResponseDto<UserResponseDto>> {
    return this.userService.findOne(id);
  }

  /**
   * API cập nhật thông tin người dùng
   *
   * @param id - UUID của người dùng cần cập nhật
   * @param updateUserDto - Dữ liệu cập nhật (có thể là một phần thông tin)
   * @returns BaseResponseDto<UserResponseDto> - Thông tin người dùng sau khi cập nhật có metadata
   *
   * HTTP Method: PUT /users/:id
   * Params: id (UUID)
   * Body: UpdateUserDto (partial update)
   * Response: 200 - BaseResponseDto<UserResponseDto> | 404 - Không tìm thấy | 409 - Email đã tồn tại
   */
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin của một người dùng',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: UserResponseExampleDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  @ApiResponse({
    status: 409,
    description: 'Email đã được sử dụng',
  })
  @Put(':id') // PUT cho phép cập nhật một phần dữ liệu
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto, // UpdateUserDto kế thừa từ CreateUserDto với PartialType
  ): Promise<BaseResponseDto<UserResponseDto>> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * API xóa người dùng khỏi hệ thống
   *
   * @param id - UUID của người dùng cần xóa
   * @returns BaseResponseDto<null> - Response với metadata xác nhận xóa thành công
   *
   * HTTP Method: DELETE /users/:id
   * Params: id (UUID)
   * Response: 204 - BaseResponseDto<null> | 404 - Không tìm thấy người dùng
   */
  @ApiOperation({
    summary: 'Xóa người dùng',
    description: 'Xóa một người dùng khỏi hệ thống',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<null>> {
    return this.userService.remove(id);
  }
}
