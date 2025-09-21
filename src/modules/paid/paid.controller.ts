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
import { PaidService } from './paid.service';
import { Paid } from './entities/paid.entity';
import { CreatePaidDto, PaidResponseDto, UpdatePaidDto } from './dto/paid.dto';
import { BaseResponseDto, PaginationDto } from '@/common/base/base.common.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';

/**
 * Paid Controller
 * Quản lý các API endpoints liên quan đến thanh toán trong hệ thống chia sẻ chi phí
 *
 * Chức năng chính:
 * - Lấy danh sách các bản ghi thanh toán với phân trang
 * - Tạo bản ghi thanh toán mới (ai trả bao nhiều cho item nào)
 * - Cập nhật thông tin thanh toán
 * - Kế thừa các chức năng CRUD từ BaseController
 */
@ApiTags('Payments')
@Controller('paid')
@UseInterceptors(ClassSerializerInterceptor)
export class PaidController extends BaseController<
  Paid,
  CreatePaidDto,
  UpdatePaidDto
> {
  constructor(private readonly paidService: PaidService) {
    super(paidService);
  }

  /**
   * Lấy danh sách tất cả các bản ghi thanh toán với phân trang
   * Có thể lọc theo người dùng hoặc item cụ thể
   */
  @ApiOperation({
    summary: 'Lấy danh sách thanh toán',
    description:
      'Trả về danh sách tất cả các bản ghi thanh toán với khả năng phân trang và lọc theo người dùng hoặc item.',
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
    description: 'Số lượng bản ghi thanh toán trên mỗi trang',
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'user_id',
    required: false,
    description: 'Lọc thanh toán theo ID người dùng',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'bill_item_id',
    required: false,
    description: 'Lọc thanh toán theo ID item trong hóa đơn',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thanh toán thành công',
    schema: {
      example: {
        success: true,
        message: 'Thành công',
        data: [
          {
            id: 1,
            amount: 25000,
            percent: 50.0,
            user_id: 1,
            bill_item_id: 1,
            user: {
              id: 1,
              email: 'user1@example.com',
              name: 'Nguyễn Văn A',
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: 2,
            amount: 25000,
            percent: 50.0,
            user_id: 2,
            bill_item_id: 1,
            user: {
              id: 2,
              email: 'user2@example.com',
              name: 'Nguyễn Văn B',
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        meta: {
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3,
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
  ): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.paidService.findAllPaid(paginationDto);
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
   * Tạo bản ghi thanh toán mới
   * Ghi nhận việc một người dùng thanh toán cho một phần của item trong hóa đơn
   */
  @ApiOperation({
    summary: 'Tạo bản ghi thanh toán mới',
    description:
      'Tạo một bản ghi thanh toán mới, ghi nhận việc một người dùng trả tiền cho một phần của item trong hóa đơn chia sẻ.',
  })
  @ApiBody({
    type: CreatePaidDto,
    description: 'Thông tin thanh toán cần tạo',
    examples: {
      'equal-split': {
        summary: 'Chia đều 2 người',
        description: 'Chia đều một món 50k cho 2 người, mỗi người trả 50%',
        value: {
          amount: 25000,
          percent: 50.0,
          user_id: 1,
          bill_item_id: 1,
        },
      },
      'unequal-split': {
        summary: 'Chia không đều',
        description: 'Một người trả 70% tổng tiền của món',
        value: {
          amount: 35000,
          percent: 70.0,
          user_id: 2,
          bill_item_id: 1,
        },
      },
      'full-payment': {
        summary: 'Trả toàn bộ',
        description: 'Một người trả hết tiền cho món này',
        value: {
          amount: 50000,
          percent: 100.0,
          user_id: 1,
          bill_item_id: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo bản ghi thanh toán thành công',
    schema: {
      example: {
        success: true,
        message: 'Tạo thành công',
        data: {
          id: 1,
          amount: 25000,
          percent: 50.0,
          user_id: 1,
          bill_item_id: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        code: 'CREATED',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
    schema: {
      example: {
        success: false,
        message:
          'Tỷ lệ phần trăm phải từ 0 đến 100 hoặc người dùng/item không tồn tại',
        code: 'BAD_REQUEST',
      },
    },
  })
  @Post()
  async create(
    @Body() createPaidDto: CreatePaidDto,
  ): Promise<BaseResponseDto<Paid | null>> {
    try {
      const data = await this.paidService.createPaid(createPaidDto);
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
   * Cập nhật thông tin thanh toán
   * Có thể thay đổi số tiền, tỷ lệ hoặc chuyển sang người/item khác
   */
  @ApiOperation({
    summary: 'Cập nhật thông tin thanh toán',
    description:
      'Cập nhật thông tin của bản ghi thanh toán như số tiền, tỷ lệ phần trăm, hoặc chuyển sang người dùng/item khác.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bản ghi thanh toán cần cập nhật',
    example: '1',
    type: String,
  })
  @ApiBody({
    type: UpdatePaidDto,
    description: 'Thông tin cần cập nhật',
    examples: {
      'update-amount': {
        summary: 'Cập nhật số tiền',
        value: {
          amount: 30000,
          percent: 60.0,
          user_id: 1,
          bill_item_id: 1,
        },
      },
      'change-person': {
        summary: 'Chuyển sang người khác',
        value: {
          amount: 25000,
          percent: 50.0,
          user_id: 3,
          bill_item_id: 1,
        },
      },
      'move-to-another-item': {
        summary: 'Chuyển sang item khác',
        value: {
          amount: 25000,
          percent: 50.0,
          user_id: 1,
          bill_item_id: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thanh toán thành công',
    schema: {
      example: {
        success: true,
        message: 'Cập nhật thành công',
        data: {
          id: 1,
          amount: 30000,
          percent: 60.0,
          user_id: 1,
          bill_item_id: 1,
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
        message: 'Tỷ lệ phần trăm phải từ 0 đến 100',
        code: 'BAD_REQUEST',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bản ghi thanh toán',
    schema: {
      example: {
        success: false,
        message: 'Bản ghi thanh toán không tồn tại',
        code: 'NOT_FOUND',
      },
    },
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaidDto: UpdatePaidDto,
  ): Promise<BaseResponseDto<Paid | null>> {
    try {
      const data = await this.paidService.updatePaid(+id, updatePaidDto);
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
