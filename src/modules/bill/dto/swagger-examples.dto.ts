import { ApiProperty } from '@nestjs/swagger';

/**
 * Example Response DTOs cho Swagger documentation
 * Hiển thị cấu trúc response với metadata
 */

export class ResponseExampleDto {
  @ApiProperty({
    description: 'Thông tin người dùng',
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      role: 'user',
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  })
  data: any;

  @ApiProperty({
    description: 'Metadata của response',
    example: {
      timestamp: '2024-01-01T00:00:00.000Z',
      requestId: '123e4567-e89b-12d3-a456-426614174000',
      version: '1.0',
      statusCode: 200,
      message: 'Success',
      responseTime: '45ms',
    },
  })
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
    statusCode: number;
    message: string;
    responseTime: string;
  };
}

export class ListResponseExampleDto {
  @ApiProperty({
    description: 'Danh sách người dùng',
    example: [
      {
        id: 1,
        email: 'user1@example.com',
        firstName: 'Nguyễn',
        lastName: 'Văn A',
        role: 'user',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        email: 'user2@example.com',
        firstName: 'Trần',
        lastName: 'Thị B',
        role: 'user',
        isActive: true,
        createdAt: '2024-01-01T01:00:00.000Z',
        updatedAt: '2024-01-01T01:00:00.000Z',
      },
    ],
  })
  data: any[];

  @ApiProperty({
    description: 'Metadata với thông tin pagination',
    example: {
      timestamp: '2024-01-01T00:00:00.000Z',
      requestId: '123e4567-e89b-12d3-a456-426614174000',
      version: '1.0',
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công',
      responseTime: '45ms',
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  })
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
    statusCode: number;
    message: string;
    responseTime: string;
    pagination: {
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
