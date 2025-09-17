import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo một tài khoản người dùng mới (chỉ admin)',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo người dùng thành công',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email đã được sử dụng',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Lấy danh sách tất cả người dùng',
    description: 'Lấy danh sách tất cả người dùng trong hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công',
    type: [UserResponseDto],
  })
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

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
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

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
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  @ApiResponse({
    status: 409,
    description: 'Email đã được sử dụng',
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

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
    status: 204,
    description: 'Xóa thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
