// Import các decorator cần thiết từ NestJS
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
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
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { BillResponseDto } from './dto/bill-response.dto';

// Import common DTOs cho pagination và response
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '@/common/dto/base-response.dto';

// Import example DTOs cho Swagger
import {
  ResponseExampleDto,
  ListResponseExampleDto,
} from './dto/swagger-examples.dto';

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
@ApiTags('Bills') // Nhóm các API endpoints trong Swagger UI
@ApiBearerAuth() // Yêu cầu JWT token để truy cập
@Controller('Bills') // Định nghĩa base route là /Bills
export class BillController {
  /**
   * Constructor - Inject BillService để xử lý business logic
   */
  constructor(private readonly BillService: BillService) {}

  /**
   * API tạo người dùng mới
   *
   * @param createBillDto - Dữ liệu tạo người dùng (email, password, name)
   * @returns BaseResponseDto<BillResponseDto> - Response có metadata
   *
   * HTTP Method: POST /Bills
   * Body: CreateBillDto
   * Response: 201 - BaseResponseDto<BillResponseDto> | 409 - Email đã tồn tại
   */
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo một tài khoản người dùng mới (chỉ admin)',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo người dùng thành công',
    type: ResponseExampleDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email đã được sử dụng',
  })
  @Post()
  async create(
    @Body() createBillDto: CreateBillDto,
  ): Promise<BaseResponseDto<BillResponseDto>> {
    return this.BillService.create(createBillDto);
  }

  /**
   * API lấy danh sách tất cả người dùng với pagination
   *
   * @param paginationQuery - Query parameters cho pagination
   * @returns PaginatedResponseDto<BillResponseDto> - Danh sách người dùng có pagination metadata
   *
   * HTTP Method: GET /Bills
   * Query: PaginationQueryDto
   * Response: 200 - PaginatedResponseDto<BillResponseDto>
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
    example: 'id',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Thứ tự sắp xếp',
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công',
    type: ListResponseExampleDto,
  })
  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<BillResponseDto>> {
    return this.BillService.findAll(paginationQuery);
  }

  /**
   * API lấy thông tin chi tiết của một người dùng
   *
   * @param id - ID của người dùng cần lấy thông tin
   * @returns BaseResponseDto<BillResponseDto> - Thông tin chi tiết của người dùng có metadata
   *
   * HTTP Method: GET /Bills/:id
   * Params: id (number) - được validate bằng ParseIntPipe
   * Response: 200 - BaseResponseDto<BillResponseDto> | 404 - Không tìm thấy người dùng
   */
  @ApiOperation({
    summary: 'Lấy thông tin người dùng theo ID',
    description: 'Lấy thông tin chi tiết của một người dùng',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    type: ResponseExampleDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number, // ParseIntPipe tự động validate format number
  ): Promise<BaseResponseDto<BillResponseDto>> {
    return this.BillService.findOne(id);
  }

  /**
   * API cập nhật thông tin người dùng
   *
   * @param id - ID của người dùng cần cập nhật
   * @param updateBillDto - Dữ liệu cập nhật (có thể là một phần thông tin)
   * @returns BaseResponseDto<BillResponseDto> - Thông tin người dùng sau khi cập nhật có metadata
   *
   * HTTP Method: PUT /Bills/:id
   * Params: id (number)
   * Body: UpdateBillDto (partial update)
   * Response: 200 - BaseResponseDto<BillResponseDto> | 404 - Không tìm thấy | 409 - Email đã tồn tại
   */
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin của một người dùng',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: ResponseExampleDto,
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDto: UpdateBillDto, // UpdateBillDto kế thừa từ CreateBillDto với PartialType
  ): Promise<BaseResponseDto<BillResponseDto>> {
    return this.BillService.update(id, updateBillDto);
  }

  /**
   * API xóa mềm người dùng khỏi hệ thống
   *
   * @param id - ID của người dùng cần xóa
   * @returns BaseResponseDto<null> - Response với metadata xác nhận xóa thành công
   *
   * HTTP Method: DELETE /Bills/:id
   * Params: id (number)
   * Response: 204 - BaseResponseDto<null> | 404 - Không tìm thấy người dùng
   */
  @ApiOperation({
    summary: 'Xóa người dùng',
    description: 'Xóa mềm một người dùng khỏi hệ thống',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng',
    example: 1,
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
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseDto<null>> {
    return this.BillService.remove(id);
  }
}
