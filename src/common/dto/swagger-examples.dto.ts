import { ApiProperty } from '@nestjs/swagger';

/**
 * Example Response DTOs cho Swagger documentation
 * Hiển thị cấu trúc response với metadata
 */

type Metadata = {
  timestamp: string;
  requestId: string;
  version: string;
  statusCode: number;
  message: string;
  responseTime: string;
};

type Pagination = Metadata & {
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type AuthResponse = {
  timestamp: string;
  requestId: string;
  version: string;
  statusCode: number;
  message: string;
  responseTime: string;
};

const EXAMPLE_META = {
  timestamp: '2024-01-01T00:00:00.000Z',
  requestId: '123e4567-e89b-12d3-a456-426614174000',
  version: '1.0',
  statusCode: 200,
  message: 'Success',
  responseTime: '45ms',
};

const EXAMPLE_PAGINATION = {
  timestamp: '2024-01-01T00:00:00.000Z',
  requestId: '123e4567-e89b-12d3-a456-426614174000',
  version: '1.0',
  statusCode: 200,
  message: 'Success',
  responseTime: '45ms',
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100,
    totalPages: 10,
    hasNextPage: true,
    hasPreviousPage: false,
  },
};

const EXAMPLE_AUTH_RESPONSE = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  user: {
    id: 1,
    email: 'user@example.com',
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  expiresAt: 1640995200,
  tokenType: 'Bearer',
  loginTime: '2024-01-01T00:00:00.000Z',
};
export class BaseResponseExampleDto<T, EX> {
  @ApiProperty({
    description: 'Dữ liệu trả về',
    example: {},
  })
  data: T;

  @ApiProperty({
    description: 'Metadata của response',
    example: EXAMPLE_META,
  })
  meta: Metadata;
}

export class PaginatedResponseExampleDto<T, EX> {
  @ApiProperty({
    description: 'Dữ liệu trả về (array)',
    example: {},
  })
  data: T[];

  @ApiProperty({
    description: 'Metadata bao gồm thông tin pagination',
    example: EXAMPLE_PAGINATION,
  })
  meta: Pagination;
}

export class AuthResponseExampleDto {
  @ApiProperty({
    description: 'Dữ liệu authentication',
    example: EXAMPLE_AUTH_RESPONSE,
  })
  data: any;

  @ApiProperty({
    description: 'Metadata của response',
    example: EXAMPLE_META,
  })
  meta: AuthResponse;
}
