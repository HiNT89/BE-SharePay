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
import { BillService } from './bill.service';
import { Bill } from './entities/bill.entity';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';
import { BaseResponseDto, PaginationDto } from '@/common/base/base.common.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';

@Controller('bill')
@UseInterceptors(ClassSerializerInterceptor)
export class BillController extends BaseController<
  Bill,
  CreateBillDto,
  UpdateBillDto
> {
  constructor(private readonly userService: BillService) {
    super(userService);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<Bill[]>> {
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
    @Body() createBillDto: CreateBillDto,
  ): Promise<BaseResponseDto<Bill | null>> {
    try {
      const data = await this.userService.createBill(createBillDto);
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
    @Body() updateBillDto: UpdateBillDto,
  ): Promise<BaseResponseDto<Bill | null>> {
    try {
      const data = await this.userService.updateBill(+id, updateBillDto);
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
