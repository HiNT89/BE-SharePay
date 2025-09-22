import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentResponseDto,
} from './dto/payment.dto';
import { BaseResponseDto } from '@/common';

@ApiTags('Payments')
@Controller('payments')
@UseInterceptors(ClassSerializerInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo mới payment',
    description: 'Ghi nhận một khoản thanh toán mới',
  })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Tạo payment thành công',
    type: PaymentResponseDto,
  })
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<BaseResponseDto<PaymentResponseDto>> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get('bill/:billId')
  @ApiOperation({
    summary: 'Lấy tất cả payments của một bill',
    description: 'Trả về danh sách tất cả payments trong một hóa đơn',
  })
  @ApiParam({ name: 'billId', description: 'ID của bill' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách payments thành công',
    type: [PaymentResponseDto],
  })
  async findByBillId(
    @Param('billId', ParseIntPipe) billId: number,
  ): Promise<BaseResponseDto<PaymentResponseDto[]>> {
    return this.paymentService.findByBillId(billId);
  }

  @Get('bill/:billId/user/:userId')
  @ApiOperation({
    summary: 'Lấy payments của một user trong bill',
    description: 'Trả về danh sách payments của một user cụ thể trong bill',
  })
  @ApiParam({ name: 'billId', description: 'ID của bill' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách payments thành công',
    type: [PaymentResponseDto],
  })
  async findByPayerIdAndBillId(
    @Param('billId', ParseIntPipe) billId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<BaseResponseDto<PaymentResponseDto[]>> {
    return this.paymentService.findByPayerIdAndBillId(userId, billId);
  }

  @Get('bill/:billId/stats')
  @ApiOperation({
    summary: 'Lấy thống kê payments theo phương thức',
    description:
      'Trả về thống kê các payments trong bill theo phương thức thanh toán',
  })
  @ApiParam({ name: 'billId', description: 'ID của bill' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  async getPaymentStats(@Param('billId', ParseIntPipe) billId: number) {
    const stats = await this.paymentService.getPaymentStatsByMethod(billId);
    return BaseResponseDto.success(stats, 'Lấy thống kê thanh toán thành công');
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật payment',
    description: 'Cập nhật thông tin của một payment',
  })
  @ApiParam({ name: 'id', description: 'ID của payment' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: PaymentResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<BaseResponseDto<PaymentResponseDto>> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa payment',
    description: 'Xóa một payment',
  })
  @ApiParam({ name: 'id', description: 'ID của payment' })
  @ApiResponse({
    status: 200,
    description: 'Xóa thành công',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseDto<void>> {
    return this.paymentService.remove(id);
  }
}
