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
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { BillService } from './bill.service';
import { CreateBillDto, UpdateBillDto, BillResponseDto } from './dto/bill.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';
import {
  BaseResponseDto,
  PaginationDto,
} from '@/common/base/base.response.dto';

/**
 * Bill Controller
 * Quản lý các API endpoints liên quan đến hóa đơn
 *
 * Chức năng chính:
 * - Lấy danh sách hóa đơn với phân trang
 * - Tạo hóa đơn mới
 * - Cập nhật thông tin hóa đơn
 * - Xóa hóa đơn
 */
@ApiTags('Bills')
@Controller('bill')
@UseInterceptors(ClassSerializerInterceptor)
export class BillController {
  constructor(private readonly service: BillService) {}

  /**
   * Lấy danh sách tất cả hóa đơn với phân trang
   * Hỗ trợ tìm kiếm và lọc dữ liệu
   */
  @ApiOperation({
    summary: 'Lấy danh sách hóa đơn',
    description:
      'Trả về danh sách tất cả hóa đơn trong hệ thống với khả năng phân trang, tìm kiếm và lọc.',
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
    description: 'Từ khóa tìm kiếm (tìm trong tiêu đề, ghi chú, mã tiền tệ)',
    example: '',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách hóa đơn thành công',
    schema: {
      example: {
        success: true,
        message: 'Thành công',
        data: [
          {
            id: 1,
            title: 'Hóa đơn ăn trưa',
            total_amount: 150000,
            original_total_amount: 150000,
            note: 'Ăn trưa tại nhà hàng ABC',
            imageUrl: 'https://example.com/bill-image.jpg',
            discount: 15000,
            percent_discount: 10,
            currency_code: 'VND',
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
  ): Promise<BaseResponseDto<BillResponseDto[]>> {
    try {
      return await this.service.getAllWithPagination(paginationDto);
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
   * Tạo hóa đơn mới
   * Validate dữ liệu đầu vào
   */
  @ApiOperation({
    summary: 'Tạo hóa đơn mới',
    description: 'Tạo một hóa đơn mới trong hệ thống.',
  })
  @ApiBody({
    type: CreateBillDto,
    description: 'Thông tin hóa đơn cần tạo',
    examples: {
      'bill-example': {
        summary: 'Hóa đơn ăn trưa',
        value: {
          title: 'Hóa đơn ăn trưa',
          total_amount: 150000,
          original_total_amount: 150000,
          note: 'Ăn trưa tại nhà hàng ABC',
          imageUrl: 'https://example.com/bill-image.jpg',
          discount: 15000,
          percent_discount: 10,
          currency_code: 'VND',
        },
      },
      'expense-example': {
        summary: 'Chi phí văn phòng',
        value: {
          title: 'Chi phí văn phòng phẩm',
          total_amount: 500000,
          original_total_amount: 500000,
          note: 'Mua bút, giấy, máy tính',
          currency_code: 'VND',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo hóa đơn thành công',
    schema: {
      example: {
        success: true,
        message: 'Tạo thành công',
        data: {
          id: 1,
          title: 'Hóa đơn ăn trưa',
          total_amount: 150000,
          original_total_amount: 150000,
          note: 'Ăn trưa tại nhà hàng ABC',
          imageUrl: 'https://example.com/bill-image.jpg',
          discount: 15000,
          percent_discount: 10,
          currency_code: 'VND',
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
        message: 'Dữ liệu không hợp lệ',
        code: 'BAD_REQUEST',
      },
    },
  })
  @Post()
  async create(
    @Body() createBillDto: CreateBillDto,
  ): Promise<BaseResponseDto<BillResponseDto | null>> {
    try {
      return await this.service.createBill(createBillDto);
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
   * Cập nhật thông tin hóa đơn theo ID
   * Hỗ trợ partial update (chỉ cập nhật các field được gửi)
   */
  @ApiOperation({
    summary: 'Cập nhật thông tin hóa đơn',
    description:
      'Cập nhật thông tin của hóa đơn theo ID. Hỗ trợ cập nhật từng phần (partial update).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của hóa đơn cần cập nhật',
    example: '1',
    type: String,
  })
  @ApiBody({
    type: UpdateBillDto,
    description: 'Thông tin cần cập nhật',
    examples: {
      'update-amount': {
        summary: 'Cập nhật số tiền',
        value: {
          total_amount: 200000,
          note: 'Đã cập nhật số tiền sau khi chia sẻ',
        },
      },
      'update-discount': {
        summary: 'Cập nhật giảm giá',
        value: {
          discount: 20000,
          percent_discount: 15,
        },
      },
      'update-image': {
        summary: 'Cập nhật hình ảnh',
        value: {
          imageUrl: 'https://example.com/new-bill-image.jpg',
        },
      },
      'update-currency': {
        summary: 'Thay đổi loại tiền tệ',
        value: {
          currency_code: 'USD',
          total_amount: 10,
          original_total_amount: 10,
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
          title: 'Hóa đơn ăn trưa',
          total_amount: 200000,
          original_total_amount: 150000,
          note: 'Đã cập nhật số tiền sau khi chia sẻ',
          imageUrl: 'https://example.com/new-bill-image.jpg',
          discount: 20000,
          percent_discount: 15,
          currency_code: 'VND',
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
    description: 'Không tìm thấy hóa đơn',
    schema: {
      example: {
        success: false,
        message: 'Hóa đơn không tồn tại',
        code: 'NOT_FOUND',
      },
    },
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBillDto: UpdateBillDto,
  ): Promise<BaseResponseDto<BillResponseDto | null>> {
    try {
      return await this.service.updateBill(+id, updateBillDto);
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
   * Xóa hóa đơn theo ID
   */
  @ApiOperation({
    summary: 'Xóa hóa đơn theo ID',
    description: 'Xóa hóa đơn khỏi hệ thống theo ID (soft delete).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của hóa đơn cần xóa',
    example: '1',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa hóa đơn thành công',
    schema: {
      example: {
        success: true,
        message: 'Xóa thành công',
        data: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy hóa đơn',
    schema: {
      example: {
        success: false,
        message: 'Hóa đơn không tồn tại',
        code: 'NOT_FOUND',
      },
    },
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResponseDto<boolean>> {
    try {
      return await this.service.delete(+id);
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
