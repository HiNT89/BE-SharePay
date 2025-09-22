import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  BillCalculationService,
  BillUserCalculation,
} from './bill-calculation.service';
import { BaseResponseDto } from '@/common';

@ApiTags('Bill Calculations')
@Controller('bill-calculations')
@UseInterceptors(ClassSerializerInterceptor)
export class BillCalculationController {
  constructor(
    private readonly billCalculationService: BillCalculationService,
  ) {}

  @Get('bill/:billId')
  @ApiOperation({
    summary: 'Tính toán nghĩa vụ thanh toán cho tất cả users trong bill',
    description:
      'Trả về thông tin chi tiết về nghĩa vụ thanh toán của từng user trong bill',
  })
  @ApiParam({ name: 'billId', description: 'ID của bill' })
  @ApiResponse({
    status: 200,
    description: 'Tính toán thành công',
  })
  async calculateBillUserObligations(
    @Param('billId', ParseIntPipe) billId: number,
  ): Promise<BaseResponseDto<BillUserCalculation[]>> {
    return this.billCalculationService.calculateBillUserObligations(billId);
  }

  @Get('bill/:billId/user/:userId')
  @ApiOperation({
    summary: 'Tính toán nghĩa vụ thanh toán cho một user cụ thể',
    description:
      'Trả về thông tin chi tiết về nghĩa vụ thanh toán của một user trong bill',
  })
  @ApiParam({ name: 'billId', description: 'ID của bill' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiResponse({
    status: 200,
    description: 'Tính toán thành công',
  })
  async calculateUserObligation(
    @Param('billId', ParseIntPipe) billId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<BaseResponseDto<BillUserCalculation>> {
    return this.billCalculationService.calculateUserObligation(userId, billId);
  }

  @Post('bill/:billId/user/:userId/update-settled')
  @ApiOperation({
    summary: 'Cập nhật trạng thái settled cho một user',
    description:
      'Kiểm tra và cập nhật trạng thái đã đối soát cho user trong bill',
  })
  @ApiParam({ name: 'billId', description: 'ID của bill' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái thành công',
  })
  async updateSettledStatus(
    @Param('billId', ParseIntPipe) billId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<BaseResponseDto<void>> {
    return this.billCalculationService.updateSettledStatus(userId, billId);
  }

  @Post('bill/:billId/update-all-settled')
  @ApiOperation({
    summary: 'Cập nhật trạng thái settled cho tất cả users trong bill',
    description:
      'Kiểm tra và cập nhật trạng thái đã đối soát cho tất cả users trong bill',
  })
  @ApiParam({ name: 'billId', description: 'ID của bill' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái thành công',
  })
  async updateAllSettledStatuses(
    @Param('billId', ParseIntPipe) billId: number,
  ): Promise<BaseResponseDto<void>> {
    return this.billCalculationService.updateAllSettledStatuses(billId);
  }
}
