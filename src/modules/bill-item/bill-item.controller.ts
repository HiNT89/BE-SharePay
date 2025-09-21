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
import { BillItemService } from './bill-item.service';
import { BillItem } from './entities/bill-item.entity';
import { CreateBillItemDto, UpdateBillItemDto } from './dto/bill-item.dto';
import { BaseResponseDto, PaginationDto } from '@/common/base/base.common.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';

/**
 * Bill Item Controller
 * Quản lý các API endpoints liên quan đến items trong hóa đơn
 *
 * Chức năng chính:
 * - Lấy danh sách items với phân trang
 * - Tạo item mới trong hóa đơn
 * - Cập nhật thông tin item
 * - Kế thừa các chức năng CRUD từ BaseController
 */
@ApiTags('Bill Items')
@Controller('bill-item')
@UseInterceptors(ClassSerializerInterceptor)
export class BillItemController extends BaseController<
  BillItem,
  CreateBillItemDto,
  UpdateBillItemDto
> {
  constructor(private readonly billItemService: BillItemService) {
    super(billItemService);
  }

  /**
   * Lấy danh sách tất cả items với phân trang
   * Có thể lọc theo hóa đơn cụ thể
   */
  @ApiOperation({
    summary: 'Lấy danh sách items trong hóa đơn',
    description:
      'Trả về danh sách tất cả items với khả năng phân trang và lọc theo hóa đơn.',
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
    description: 'Số lượng items trên mỗi trang',
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Từ khóa tìm kiếm (tìm trong tên item)',
    example: 'cơm',
    type: String,
  })
  @ApiQuery({
    name: 'bill_id',
    required: false,
    description: 'Lọc items theo ID hóa đơn',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách items thành công',
    schema: {
      example: {
        success: true,
        message: 'Thành công',
        data: [
          {
            id: 1,
            name: 'Cơm gà',
            price: 50000,
            quantity: 2,
            bill_id: 1,
            paidList: [
              {
                id: 1,
                amount: 50000,
                user_id: 1,
              },
            ],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: 2,
            name: 'Nước uống',
            price: 25000,
            quantity: 4,
            bill_id: 1,
            paidList: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        meta: {
          total: 15,
          page: 1,
          limit: 10,
          totalPages: 2,
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
  ): Promise<BaseResponseDto<BillItem[]>> {
    try {
      return await this.billItemService.findAll(paginationDto);
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
   * Tạo item mới trong hóa đơn
   * Thêm một món/sản phẩm mới vào hóa đơn chia sẻ
   */
  @ApiOperation({
    summary: 'Tạo item mới trong hóa đơn',
    description:
      'Thêm một item/món ăn/sản phẩm mới vào hóa đơn. Item này có thể được chia sẻ cho nhiều người.',
  })
  @ApiBody({
    type: CreateBillItemDto,
    description: 'Thông tin item cần tạo',
    examples: {
      'food-item': {
        summary: 'Món ăn',
        value: {
          name: 'Cơm gà',
          price: 50000,
          quantity: 2,
          bill_id: 1,
        },
      },
      'drink-item': {
        summary: 'Đồ uống',
        value: {
          name: 'Trà đá',
          price: 10000,
          quantity: 4,
          bill_id: 1,
        },
      },
      'service-item': {
        summary: 'Dịch vụ',
        value: {
          name: 'Phí dịch vụ',
          price: 20000,
          quantity: 1,
          bill_id: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo item thành công',
    schema: {
      example: {
        success: true,
        message: 'Tạo thành công',
        data: {
          id: 1,
          name: 'Cơm gà',
          price: 50000,
          quantity: 2,
          bill_id: 1,
          paidList: [],
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
        message: 'Hóa đơn không tồn tại hoặc giá phải lớn hơn 0',
        code: 'BAD_REQUEST',
      },
    },
  })
  @Post()
  async create(
    @Body() createBillItemDto: CreateBillItemDto,
  ): Promise<BaseResponseDto<BillItem | null>> {
    try {
      const data = await this.billItemService.createBillItem(createBillItemDto);
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
   * Cập nhật thông tin item trong hóa đơn
   * Có thể thay đổi tên, giá, số lượng hoặc chuyển sang hóa đơn khác
   */
  @ApiOperation({
    summary: 'Cập nhật thông tin item',
    description:
      'Cập nhật thông tin của item như tên, giá, số lượng. Cũng có thể chuyển item sang hóa đơn khác.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của item cần cập nhật',
    example: '1',
    type: String,
  })
  @ApiBody({
    type: UpdateBillItemDto,
    description: 'Thông tin cần cập nhật',
    examples: {
      'update-price': {
        summary: 'Cập nhật giá',
        value: {
          name: 'Cơm gà',
          price: 55000,
          quantity: 2,
          bill_id: 1,
        },
      },
      'update-quantity': {
        summary: 'Cập nhật số lượng',
        value: {
          name: 'Cơm gà',
          price: 50000,
          quantity: 3,
          bill_id: 1,
        },
      },
      'move-to-another-bill': {
        summary: 'Chuyển sang hóa đơn khác',
        value: {
          name: 'Cơm gà',
          price: 50000,
          quantity: 2,
          bill_id: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật item thành công',
    schema: {
      example: {
        success: true,
        message: 'Cập nhật thành công',
        data: {
          id: 1,
          name: 'Cơm gà',
          price: 55000,
          quantity: 2,
          bill_id: 1,
          paidList: [],
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
        message: 'Giá phải lớn hơn 0',
        code: 'BAD_REQUEST',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy item',
    schema: {
      example: {
        success: false,
        message: 'Item không tồn tại',
        code: 'NOT_FOUND',
      },
    },
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBillItemDto: UpdateBillItemDto,
  ): Promise<BaseResponseDto<BillItem | null>> {
    try {
      const data = await this.billItemService.updateBillItem(
        +id,
        updateBillItemDto,
      );
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
