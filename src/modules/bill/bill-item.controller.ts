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
import { BillItemService } from './bill-item.service';
import {
  CreateBillItemDto,
  UpdateBillItemDto,
  BillItemResponseDto,
} from './dto/bill-item.dto';
import { BaseResponseDto } from '@/common';

@ApiTags('Bill Items')
@Controller('bill-items')
@UseInterceptors(ClassSerializerInterceptor)
export class BillItemController {
  constructor(private readonly billItemService: BillItemService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo mới bill item',
    description: 'Tạo một item mới trong hóa đơn với thông tin chi tiết',
  })
  @ApiBody({ type: CreateBillItemDto })
  @ApiResponse({
    status: 201,
    description: 'Tạo bill item thành công',
    type: BillItemResponseDto,
  })
  async create(
    @Body() createBillItemDto: CreateBillItemDto,
  ): Promise<BaseResponseDto<BillItemResponseDto>> {
    return this.billItemService.create(createBillItemDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin bill item theo ID',
    description: 'Trả về thông tin chi tiết của một bill item',
  })
  @ApiParam({ name: 'id', description: 'ID của bill item' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    type: BillItemResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseDto<BillItemResponseDto>> {
    return this.billItemService.findOne(id);
  }

  @Get('bill/:billId')
  @ApiOperation({
    summary: 'Lấy tất cả items của một bill',
    description: 'Trả về danh sách tất cả items trong một hóa đơn',
  })
  @ApiParam({ name: 'billId', description: 'ID của bill' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách items thành công',
    type: [BillItemResponseDto],
  })
  async findByBillId(
    @Param('billId', ParseIntPipe) billId: number,
  ): Promise<BaseResponseDto<BillItemResponseDto[]>> {
    return this.billItemService.findByBillId(billId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật bill item',
    description: 'Cập nhật thông tin của một bill item',
  })
  @ApiParam({ name: 'id', description: 'ID của bill item' })
  @ApiBody({ type: UpdateBillItemDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: BillItemResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillItemDto: UpdateBillItemDto,
  ): Promise<BaseResponseDto<BillItemResponseDto>> {
    return this.billItemService.update(id, updateBillItemDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa bill item',
    description: 'Xóa một item khỏi hóa đơn',
  })
  @ApiParam({ name: 'id', description: 'ID của bill item' })
  @ApiResponse({
    status: 200,
    description: 'Xóa thành công',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseDto<void>> {
    return this.billItemService.remove(id);
  }
}
