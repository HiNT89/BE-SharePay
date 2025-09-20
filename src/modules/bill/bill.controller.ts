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
import { BillService } from './bill.service';
import { Bill } from './entities/bill.entity';
import { CreateBillDto, UpdateBillDto, BillResponseDto } from './dto/bill.dto';
import { BaseResponseDto, PaginationDto } from '@/common/base/base.common.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';

@Controller('bill')
@UseInterceptors(ClassSerializerInterceptor)
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get()
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
