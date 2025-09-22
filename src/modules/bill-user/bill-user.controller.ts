import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BillUserService } from './bill-user.service';
import {
  CreateBillUserDto,
  UpdateBillUserDto,
  MarkPaidDto,
  BillUserResponseDto,
  SplitBillDto,
} from './dto/bill-user.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';
import { BaseResponseDto } from '@/common/base/base.response.dto';

/**
 * BillUser Controller
 * Quản lý các API endpoints liên quan đến quan hệ hóa đơn-người dùng
 */
@ApiTags('Bill Users')
@Controller('bill-users')
@UseInterceptors(ClassSerializerInterceptor)
export class BillUserController {
  constructor(private readonly service: BillUserService) {}

  /**
   * Thêm người dùng vào hóa đơn
   */
  @ApiOperation({
    summary: 'Thêm người dùng vào hóa đơn',
    description: 'Thêm một người dùng vào hóa đơn với số tiền cần thanh toán cụ thể.',
  })
  @ApiBody({
    type: CreateBillUserDto,
    description: 'Thông tin về người dùng và số tiền cần thanh toán',
    examples: {
      'add-user-to-bill': {
        summary: 'Thêm người dùng vào hóa đơn',
        value: {
          billId: 1,
          userId: 1,
          amount_to_pay: 75000,
          payment_note: 'Chia đều cho 2 người',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Thêm người dùng vào hóa đơn thành công',
    type: BillUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Hóa đơn hoặc người dùng không tồn tại',
  })
  @ApiResponse({
    status: 409,
    description: 'Người dùng đã được thêm vào hóa đơn này',
  })
  @Post()
  async addUserToBill(
    @Body() createBillUserDto: CreateBillUserDto,
  ): Promise<BaseResponseDto<BillUserResponseDto | null>> {
    try {
      return await this.service.addUserToBill(createBillUserDto);
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
   * Chia hóa đơn cho nhiều người
   */
  @ApiOperation({
    summary: 'Chia hóa đơn cho nhiều người',
    description: 'Chia một hóa đơn cho nhiều người dùng với số tiền cụ thể cho từng người.',
  })
  @ApiBody({
    type: SplitBillDto,
    description: 'Thông tin về cách chia hóa đơn',
    examples: {
      'split-bill': {
        summary: 'Chia hóa đơn cho 3 người',
        value: {
          billId: 1,
          users: [
            { userId: 1, amount_to_pay: 50000, payment_note: 'Phần của An' },
            { userId: 2, amount_to_pay: 50000, payment_note: 'Phần của Bình' },
            { userId: 3, amount_to_pay: 50000, payment_note: 'Phần của Chương' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Chia hóa đơn thành công',
    type: [BillUserResponseDto],
  })
  @Post('split')
  async splitBill(
    @Body() splitBillDto: SplitBillDto,
  ): Promise<BaseResponseDto<BillUserResponseDto[]>> {
    try {
      return await this.service.splitBill(splitBillDto);
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
   * Lấy danh sách người dùng trong hóa đơn
   */
  @ApiOperation({
    summary: 'Lấy danh sách người dùng trong hóa đơn',
    description: 'Trả về danh sách tất cả người dùng trong một hóa đơn cùng thông tin thanh toán.',
  })
  @ApiParam({
    name: 'billId',
    description: 'ID của hóa đơn',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công',
    type: [BillUserResponseDto],
  })
  @Get('bill/:billId/users')
  async getUsersInBill(
    @Param('billId') billId: string,
  ): Promise<BaseResponseDto<BillUserResponseDto[]>> {
    try {
      return await this.service.getUsersInBill(+billId);
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
   * Lấy danh sách hóa đơn của người dùng
   */
  @ApiOperation({
    summary: 'Lấy danh sách hóa đơn của người dùng',
    description: 'Trả về danh sách tất cả hóa đơn mà người dùng tham gia.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID của người dùng',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công',
    type: [BillUserResponseDto],
  })
  @Get('user/:userId/bills')
  async getBillsOfUser(
    @Param('userId') userId: string,
  ): Promise<BaseResponseDto<BillUserResponseDto[]>> {
    try {
      return await this.service.getBillsOfUser(+userId);
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
   * Đánh dấu đã thanh toán
   */
  @ApiOperation({
    summary: 'Đánh dấu đã thanh toán',
    description: 'Đánh dấu rằng người dùng đã thanh toán phần của mình trong hóa đơn.',
  })
  @ApiParam({
    name: 'billId',
    description: 'ID của hóa đơn',
    example: '1',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID của người dùng',
    example: '1',
  })
  @ApiBody({
    type: MarkPaidDto,
    description: 'Ghi chú về việc thanh toán (tùy chọn)',
    examples: {
      'mark-paid': {
        summary: 'Đánh dấu đã thanh toán',
        value: {
          payment_note: 'Đã thanh toán bằng chuyển khoản',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Đánh dấu thanh toán thành công',
    type: BillUserResponseDto,
  })
  @Put('bill/:billId/user/:userId/mark-paid')
  async markAsPaid(
    @Param('billId') billId: string,
    @Param('userId') userId: string,
    @Body() markPaidDto: MarkPaidDto,
  ): Promise<BaseResponseDto<BillUserResponseDto | null>> {
    try {
      return await this.service.markAsPaid(+billId, +userId, markPaidDto);
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
   */
  @ApiOperation({
    summary: 'Cập nhật thông tin thanh toán',
    description: 'Cập nhật số tiền, trạng thái thanh toán hoặc ghi chú của một người dùng trong hóa đơn.',
  })
  @ApiParam({
    name: 'billId',
    description: 'ID của hóa đơn',
    example: '1',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID của người dùng',
    example: '1',
  })
  @ApiBody({
    type: UpdateBillUserDto,
    description: 'Thông tin cần cập nhật',
    examples: {
      'update-amount': {
        summary: 'Cập nhật số tiền',
        value: {
          amount_to_pay: 100000,
          payment_note: 'Đã tăng số tiền do có tip',
        },
      },
      'update-payment-status': {
        summary: 'Cập nhật trạng thái thanh toán',
        value: {
          is_paid: true,
          payment_note: 'Đã thanh toán bằng tiền mặt',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: BillUserResponseDto,
  })
  @Put('bill/:billId/user/:userId')
  async updateBillUser(
    @Param('billId') billId: string,
    @Param('userId') userId: string,
    @Body() updateBillUserDto: UpdateBillUserDto,
  ): Promise<BaseResponseDto<BillUserResponseDto | null>> {
    try {
      return await this.service.updateBillUser(+billId, +userId, updateBillUserDto);
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
   * Xóa người dùng khỏi hóa đơn
   */
  @ApiOperation({
    summary: 'Xóa người dùng khỏi hóa đơn',
    description: 'Xóa một người dùng khỏi hóa đơn (soft delete).',
  })
  @ApiParam({
    name: 'billId',
    description: 'ID của hóa đơn',
    example: '1',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID của người dùng',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa người dùng khỏi hóa đơn thành công',
  })
  @Delete('bill/:billId/user/:userId')
  async removeUserFromBill(
    @Param('billId') billId: string,
    @Param('userId') userId: string,
  ): Promise<BaseResponseDto<boolean>> {
    try {
      return await this.service.removeUserFromBill(+billId, +userId);
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
   * Lấy thống kê thanh toán của hóa đơn
   */
  @ApiOperation({
    summary: 'Lấy thống kê thanh toán của hóa đơn',
    description: 'Trả về thống kê về số tiền đã thanh toán, chưa thanh toán và danh sách người chưa thanh toán.',
  })
  @ApiParam({
    name: 'billId',
    description: 'ID của hóa đơn',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
    schema: {
      example: {
        success: true,
        message: 'Lấy thống kê thành công',
        data: {
          totalPaid: 75000,
          totalUnpaid: 75000,
          unpaidUsersCount: 1,
          unpaidUsers: [
            {
              userId: 2,
              userName: 'Nguyễn Văn B',
              userEmail: 'user2@example.com',
              amountToPay: 75000,
            },
          ],
        },
      },
    },
  })
  @Get('bill/:billId/payment-stats')
  async getBillPaymentStats(@Param('billId') billId: string) {
    try {
      return await this.service.getBillPaymentStats(+billId);
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
}