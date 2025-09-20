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
import { PaidService } from './paid.service';
import { Paid } from './entities/paid.entity';
import { CreatePaidDto, UpdatePaidDto } from './dto/paid.dto';
import { BaseResponseDto, PaginationDto } from '@/common/base/base.common.dto';
import {
  ResponseCode,
  RESPONSE_MESSAGES,
} from '@/common/config/response.config';

@Controller('paid')
@UseInterceptors(ClassSerializerInterceptor)
export class PaidController extends BaseController<
  Paid,
  CreatePaidDto,
  UpdatePaidDto
> {
  constructor(private readonly userService: PaidService) {
    super(userService);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<Paid[]>> {
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
    @Body() createPaidDto: CreatePaidDto,
  ): Promise<BaseResponseDto<Paid | null>> {
    try {
      const data = await this.userService.createPaid(createPaidDto);
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
    @Body() updatePaidDto: UpdatePaidDto,
  ): Promise<BaseResponseDto<Paid | null>> {
    try {
      const data = await this.userService.updatePaid(+id, updatePaidDto);
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
