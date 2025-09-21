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
  SerializeOptions,
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
import { Bill } from './entities/bill.entity';
import { CreateBillDto, UpdateBillDto, BillResponseDto } from './dto/bill.dto';
import { BaseResponseDto, PaginationDto } from '@/common/base/base.common.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';

/**
 * Bill Controller
 * Quản lý các API endpoints liên quan đến hóa đơn chia sẻ chi phí
 *
 * Chức năng chính:
 * - Lấy danh sách hóa đơn với phân trang
 * - Lấy chi tiết một hóa đơn cụ thể
 * - Tạo hóa đơn mới
 * - Cập nhật thông tin hóa đơn
 */
@ApiTags('Bills')
@Controller('bill')
@UseInterceptors(ClassSerializerInterceptor)
export class BillController {
  constructor(private readonly billService: BillService) {}

  /**
   * Lấy danh sách tất cả hóa đơn với phân trang
   * Bao gồm thông tin người tạo và các item trong hóa đơn
   */
  @ApiOperation({
    summary: 'Lấy danh sách hóa đơn',
    description:
      'Trả về danh sách tất cả hóa đơn trong hệ thống với khả năng phân trang, bao gồm thông tin người tạo và các item.',
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
    description: 'Số lượng hóa đơn trên mỗi trang',
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Từ khóa tìm kiếm (tìm trong tiêu đề và ghi chú)',
    example: 'cơm trưa',
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
            title: 'Tiền cơm trưa nhóm',
            currency_code: 'VND',
            total_amount: 500000,
            note: 'Ăn trưa tại nhà hàng ABC',
            imageUrl: 'https://example.com/bill1.jpg',
            userCreateId: 1,
            user: {
              id: 1,
              email: 'user@example.com',
              name: 'Nguyễn Văn A',
            },
            billItems: [
              {
                id: 1,
                item_name: 'Cơm gà',
                price: 50000,
                quantity: 2,
              },
            ],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        meta: {
          total: 50,
          page: 1,
          limit: 10,
          totalPages: 5,
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
  @SerializeOptions({ groups: ['bill'] }) // chỉ các field có group 'bill' được expose
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<BillResponseDto[]>> {
    try {
      return await this.billService.findAllBills(paginationDto);
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
   * Lấy thông tin chi tiết của một hóa đơn
   * Bao gồm đầy đủ thông tin người tạo, các item và lịch sử thanh toán
   */
  @ApiOperation({
    summary: 'Lấy chi tiết hóa đơn',
    description:
      'Trả về thông tin chi tiết của một hóa đơn cụ thể, bao gồm thông tin người tạo, danh sách items và lịch sử thanh toán.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của hóa đơn cần lấy thông tin',
    example: '1',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin hóa đơn thành công',
    schema: {
      example: {
        success: true,
        message: 'Lấy dữ liệu thành công',
        data: {
          id: 1,
          title: 'Tiền cơm trưa nhóm',
          currency_code: 'VND',
          total_amount: 500000,
          note: 'Ăn trưa tại nhà hàng ABC, chia đều cho 4 người',
          imageUrl: 'https://example.com/bill1.jpg',
          userCreateId: 1,
          user: {
            id: 1,
            email: 'user@example.com',
            name: 'Nguyễn Văn A',
            avatarUrl: 'https://example.com/avatar1.jpg',
          },
          billItems: [
            {
              id: 1,
              item_name: 'Cơm gà',
              price: 50000,
              quantity: 2,
              total_price: 100000,
            },
            {
              id: 2,
              item_name: 'Nước uống',
              price: 25000,
              quantity: 4,
              total_price: 100000,
            },
          ],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
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
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<BillResponseDto | null>> {
    try {
      const data = await this.billService.findOneBill(+id);
      return BaseResponseDto.success(data, RESPONSE_MESSAGES.RETRIEVED_SUCCESS);
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
   * Khởi tạo một hóa đơn chia sẻ chi phí mới trong hệ thống
   */
  @ApiOperation({
    summary: 'Tạo hóa đơn mới',
    description:
      'Tạo một hóa đơn chia sẻ chi phí mới. Sau khi tạo thành công, có thể thêm các items vào hóa đơn.',
  })
  @ApiBody({
    type: CreateBillDto,
    description: 'Thông tin hóa đơn cần tạo',
    examples: {
      'lunch-bill': {
        summary: 'Hóa đơn cơm trưa',
        value: {
          userCreateId: 1,
          total_amount: 500000,
          title: 'Tiền cơm trưa nhóm',
          note: 'Ăn trưa tại nhà hàng ABC, chia đều cho 4 người',
          imageUrl: 'https://example.com/lunch-bill.jpg',
        },
      },
      'dinner-bill': {
        summary: 'Hóa đơn cơm tối',
        value: {
          userCreateId: 2,
          total_amount: 800000,
          title: 'Tiền cơm tối team building',
          note: 'Ăn tối sau buổi team building, có đồ uống',
          imageUrl: 'https://example.com/dinner-bill.jpg',
        },
      },
      'simple-bill': {
        summary: 'Hóa đơn đơn giản',
        value: {
          userCreateId: 1,
          total_amount: 200000,
          title: 'Cafe sáng',
          note: 'Uống cafe sáng cùng đồng nghiệp',
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
          title: 'Tiền cơm trưa nhóm',
          currency_code: 'VND',
          total_amount: 500000,
          note: 'Ăn trưa tại nhà hàng ABC, chia đều cho 4 người',
          imageUrl: 'https://example.com/lunch-bill.jpg',
          userCreateId: 1,
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
        message: 'Số tiền phải lớn hơn 0',
        code: 'BAD_REQUEST',
      },
    },
  })
  @Post()
  async create(
    @Body() createBillDto: CreateBillDto,
  ): Promise<BaseResponseDto<Bill | null>> {
    try {
      const data = await this.billService.createBill(createBillDto);
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
   * Cập nhật thông tin hóa đơn
   * Chỉ cho phép cập nhật thông tin cơ bản, không thay đổi người tạo
   */
  @ApiOperation({
    summary: 'Cập nhật thông tin hóa đơn',
    description:
      'Cập nhật thông tin của hóa đơn như tiêu đề, tổng tiền, ghi chú và hình ảnh. Không thể thay đổi người tạo hóa đơn.',
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
          userCreateId: 1,
          total_amount: 600000,
          title: 'Tiền cơm trưa nhóm',
          note: 'Ăn trưa tại nhà hàng ABC, có thêm tráng miệng',
          imageUrl: 'https://example.com/updated-bill.jpg',
        },
      },
      'update-title': {
        summary: 'Cập nhật tiêu đề',
        value: {
          userCreateId: 1,
          total_amount: 500000,
          title: 'Tiền cơm trưa + café',
          note: 'Ăn trưa và uống café sau đó',
          imageUrl: 'https://example.com/lunch-coffee.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật hóa đơn thành công',
    schema: {
      example: {
        success: true,
        message: 'Cập nhật thành công',
        data: {
          id: 1,
          title: 'Tiền cơm trưa nhóm',
          currency_code: 'VND',
          total_amount: 600000,
          note: 'Ăn trưa tại nhà hàng ABC, có thêm tráng miệng',
          imageUrl: 'https://example.com/updated-bill.jpg',
          userCreateId: 1,
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
        message: 'Số tiền phải lớn hơn 0',
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
  ): Promise<BaseResponseDto<Bill | null>> {
    try {
      const data = await this.billService.updateBill(+id, updateBillDto);
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
