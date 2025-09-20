import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponseDto } from '../base/base.common.dto';
import { ResponseCode, RESPONSE_MESSAGES } from '../config/response.config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = RESPONSE_MESSAGES.INTERNAL_ERROR;
    let code = ResponseCode.INTERNAL_SERVER_ERROR;
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        'data' in (exceptionResponse as any)
      ) {
        // If it's already a BaseResponseDto structure, use it
        return response.status(status).json(exceptionResponse);
      }

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors || [];
      }

      // Map HTTP status to our ResponseCode
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          code = ResponseCode.BAD_REQUEST;
          break;
        case HttpStatus.UNAUTHORIZED:
          code = ResponseCode.UNAUTHORIZED;
          break;
        case HttpStatus.FORBIDDEN:
          code = ResponseCode.FORBIDDEN;
          break;
        case HttpStatus.NOT_FOUND:
          code = ResponseCode.NOT_FOUND;
          break;
        case HttpStatus.CONFLICT:
          code = ResponseCode.CONFLICT;
          break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          code = ResponseCode.VALIDATION_ERROR;
          break;
        default:
          code = ResponseCode.INTERNAL_SERVER_ERROR;
      }
    }

    const errorResponse = BaseResponseDto.error(message, code, errors);

    response.status(status).json(errorResponse);
  }
}
