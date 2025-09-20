# 🚀 Enhanced API System với Base Response và Pagination

## 📋 Tổng quan

Hệ thống API đã được nâng cấp với:

- **Config Response** chuẩn hóa
- **Pagination** nâng cao với search và sort
- **Error handling** toàn cục
- **Response format** thống nhất

## 🏗️ Cấu trúc Response mới

### BaseResponseDto

```typescript
{
  "status": "success" | "error" | "warning" | "info",
  "code": 200 | 201 | 400 | 404 | 500...,
  "message": "Operation successful",
  "data": T | null,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "sortBy": "id",
    "sortOrder": "DESC"
  },
  "timestamp": "2025-09-20T10:30:00.000Z",
  "errors": []
}
```

### PaginationDto nâng cao

```typescript
{
  "page": 1,          // Trang hiện tại (default: 1)
  "limit": 10,        // Số item per page (default: 10, max: 100)
  "sortBy": "id",     // Trường sort (default: "id")
  "sortOrder": "DESC", // Thứ tự sort: ASC/DESC (default: "DESC")
  "search": "keyword" // Từ khóa tìm kiếm (optional)
}
```

## 🎯 API Endpoints

### 1. **GET /users** - Danh sách users với pagination

```bash
GET /users?page=1&limit=10&sortBy=createdAt&sortOrder=DESC&search=john
```

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-09-20T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false,
    "sortBy": "createdAt",
    "sortOrder": "DESC"
  },
  "timestamp": "2025-09-20T10:30:00.000Z"
}
```

### 2. **GET /users/:id** - Chi tiết user

```bash
GET /users/1
```

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Resource retrieved successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  },
  "timestamp": "2025-09-20T10:30:00.000Z"
}
```

### 3. **POST /users** - Tạo user mới

```json
{
  "email": "new@example.com",
  "name": "New User",
  "password": "password123",
  "role": "user"
}
```

**Response:**

```json
{
  "status": "success",
  "code": 201,
  "message": "Resource created successfully",
  "data": {
    "id": 2,
    "email": "new@example.com",
    "name": "New User"
  },
  "timestamp": "2025-09-20T10:30:00.000Z"
}
```

### 4. **GET /users/active** - Users đang hoạt động (có pagination)

```bash
GET /users/active?page=1&limit=5
```

### 5. **GET /users/role/:role** - Users theo role (có pagination)

```bash
GET /users/role/admin?page=1&limit=10
```

### 6. **GET /users/stats** - Thống kê users

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "User statistics retrieved successfully",
  "data": {
    "total": 100,
    "active": 85,
    "inactive": 15,
    "byRole": {
      "user": 80,
      "admin": 15,
      "moderator": 5
    }
  }
}
```

## 🔧 Tính năng nâng cao

### 1. Search Functionality

- Tự động search trong các trường: `email`, `name`
- Có thể override trong service con

### 2. Sort Options

- Sort theo bất kỳ trường nào
- Hỗ trợ ASC/DESC
- Default sort theo `id DESC`

### 3. Response Codes

```typescript
enum ResponseCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}
```

### 4. Response Messages

Tất cả messages được chuẩn hóa trong `RESPONSE_MESSAGES`:

- `CREATED_SUCCESS`: "Resource created successfully"
- `UPDATED_SUCCESS`: "Resource updated successfully"
- `DELETED_SUCCESS`: "Resource deleted successfully"
- `NOT_FOUND`: "Resource not found"
- etc...

## 🛠️ Cách sử dụng cho modules mới

### 1. Entity

```typescript
@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  price: number;
}
```

### 2. Service

```typescript
@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }

  // Override search cho Product
  protected buildSearchQuery(
    search: string,
  ): FindOptionsWhere<Product> | FindOptionsWhere<Product>[] {
    return [{ name: ILike(`%${search}%`) }];
  }
}
```

### 3. Controller

```typescript
@Controller('products')
export class ProductController extends BaseController<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }
  // Tất cả CRUD endpoints đã có sẵn!
}
```

## 📦 Global Setup

### App Module

```typescript
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor, GlobalExceptionFilter } from './common';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
```

## 🎉 Lợi ích

1. **Consistency**: Response format thống nhất
2. **Error Handling**: Xử lý lỗi tự động
3. **Pagination**: Tính năng phân trang hoàn chỉnh
4. **Search**: Tìm kiếm linh hoạt
5. **Sort**: Sắp xếp đa dạng
6. **Reusability**: Tái sử dụng cho mọi module
7. **Type Safety**: TypeScript support đầy đủ
8. **HTTP Standards**: Tuân thủ chuẩn HTTP status codes

## 🔍 Query Examples

```bash
# Pagination cơ bản
GET /users?page=2&limit=20

# Search + pagination
GET /users?page=1&limit=10&search=admin

# Sort + pagination
GET /users?page=1&limit=10&sortBy=createdAt&sortOrder=ASC

# Combo tất cả
GET /users?page=1&limit=10&sortBy=email&sortOrder=ASC&search=gmail
```
