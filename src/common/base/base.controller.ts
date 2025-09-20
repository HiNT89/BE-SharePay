import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { PaginationDto, BaseResponseDto } from './base.common.dto';
import { ResponseCode, RESPONSE_MESSAGES } from '../config/response.config';
import { BaseEntity } from './base.entity';

export abstract class BaseController<
  T extends BaseEntity,
  CreateDto,
  UpdateDto,
> {
  constructor(protected readonly service: BaseService<T>) {}

  @Post()
  async create(
    @Body() createDto: CreateDto,
  ): Promise<BaseResponseDto<T | null>> {
    try {
      const data = await this.service.create(createDto as any);
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

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BaseResponseDto<T[]>> {
    try {
      return await this.service.findAll(paginationDto);
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
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<T | null>> {
    try {
      const data = await this.service.findOne(+id);
      if (!data) {
        throw new HttpException(
          BaseResponseDto.error(
            RESPONSE_MESSAGES.NOT_FOUND,
            ResponseCode.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      return BaseResponseDto.success(data, RESPONSE_MESSAGES.RETRIEVED_SUCCESS);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        BaseResponseDto.error(
          error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
          ResponseCode.INTERNAL_SERVER_ERROR,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ): Promise<BaseResponseDto<T | null>> {
    try {
      const existingEntity = await this.service.findOne(+id);
      if (!existingEntity) {
        throw new HttpException(
          BaseResponseDto.error(
            RESPONSE_MESSAGES.NOT_FOUND,
            ResponseCode.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        );
      }

      const data = await this.service.update(+id, updateDto as any);
      return BaseResponseDto.success(data, RESPONSE_MESSAGES.UPDATED_SUCCESS);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        BaseResponseDto.error(
          error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
          ResponseCode.BAD_REQUEST,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BaseResponseDto<null>> {
    try {
      const existingEntity = await this.service.findOne(+id);
      if (!existingEntity) {
        throw new HttpException(
          BaseResponseDto.error(
            RESPONSE_MESSAGES.NOT_FOUND,
            ResponseCode.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        );
      }

      await this.service.remove(+id);
      return BaseResponseDto.success(
        null,
        RESPONSE_MESSAGES.DELETED_SUCCESS,
        ResponseCode.NO_CONTENT,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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
