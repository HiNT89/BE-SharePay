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
import { BaseController } from '@/common/base/base.controller';
import { BillItemService } from './bill-item.service';
import { BillItem } from './entities/bill-item.entity';
import { CreateBillItemDto, UpdateBillItemDto } from './dto/bill-item.dto';
import { BaseResponseDto, PaginationDto } from '@/common/base/base.common.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';

@Controller('bill-item')
@UseInterceptors(ClassSerializerInterceptor)
export class BillItemController extends BaseController<
  BillItem,
  CreateBillItemDto,
  UpdateBillItemDto
> {
  constructor(private readonly userService: BillItemService) {
    super(userService);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<BillItem[]>> {
    try {
      return await this.userService.findAll(paginationDto);
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

  @Post()
  async create(
    @Body() createBillItemDto: CreateBillItemDto,
  ): Promise<BaseResponseDto<BillItem | null>> {
    try {
      const data = await this.userService.createBillItem(createBillItemDto);
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBillItemDto: UpdateBillItemDto,
  ): Promise<BaseResponseDto<BillItem | null>> {
    try {
      const data = await this.userService.updateBillItem(
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
