// Import decorator Injectable từ NestJS
import { Injectable } from '@nestjs/common';

// Import AuthGuard từ NestJS Passport
import { AuthGuard } from '@nestjs/passport';

/**
 * Local Authentication Guard
 *
 * Chức năng:
 * - Sử dụng LocalStrategy để authenticate với email/password
 * - Thường được dùng cho login endpoint
 * - Tự động extract email/password từ request body
 *
 * Cách sử dụng:
 * @UseGuards(LocalAuthGuard)
 *
 * Note: Trong project hiện tại, login được xử lý trực tiếp
 * trong AuthController mà không sử dụng guard này
 * Tuy nhiên, guard này có thể được sử dụng nếu muốn
 * tách biệt authentication logic
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
