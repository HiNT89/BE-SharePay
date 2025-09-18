import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Thông tin người dùng',
    type: UserResponseDto,
  })

  @ApiProperty({
    description: 'Thời gian token hết hạn (Unix timestamp)',
    example: 1640995200,
  })
  expiresAt: number;

  @ApiProperty({
    description: 'Loại token',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Thời gian đăng nhập',
    example: '2024-01-01T00:00:00.000Z',
  })
  loginTime: string;
}
