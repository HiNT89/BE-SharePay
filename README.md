# SharePay Backend API

SharePay là một ứng dụng backend được xây dựng bằng NestJS để quản lý việc chia sẻ chi phí. API này cung cấp các chức năng đăng nhập, đăng ký, quản lý người dùng và bảo mật với JWT.

## 🚀 Tính năng

- ✅ **Xác thực người dùng**: Đăng ký, đăng nhập với JWT
- ✅ **CRUD người dùng**: Tạo, đọc, cập nhật, xóa người dùng
- ✅ **Phân quyền**: Role-based access control (USER/ADMIN)
- ✅ **Bảo mật**: Bcrypt cho mã hóa mật khẩu, JWT cho xác thực
- ✅ **Validation**: Class-validator cho kiểm tra dữ liệu đầu vào
- ✅ **Documentation**: Swagger UI tự động
- ✅ **Database**: TypeORM với MySQL
- ✅ **Error Handling**: Global exception filter

## 🛠️ Công nghệ sử dụng

- **Framework**: NestJS
- **Database**: MySQL với TypeORM
- **Authentication**: JWT (JSON Web Token)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- MySQL >= 8.0
- npm hoặc yarn

## ⚙️ Cài đặt và chạy

### 1. Clone repository và cài đặt dependencies

\`\`\`bash

# Clone repository (nếu có)

git clone <repository-url>
cd sharepay-backend

# Cài đặt dependencies

npm install
\`\`\`

### 2. Cấu hình môi trường

Tạo file `.env` và cấu hình các biến môi trường:

\`\`\`env

# Database Configuration

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_NAME=sharepay_db

# JWT Configuration

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRATION=24h

# App Configuration

PORT=3000
NODE_ENV=development
\`\`\`

### 3. Tạo database

Tạo database MySQL:

\`\`\`sql
CREATE DATABASE sharepay_db;
\`\`\`

### 4. Chạy ứng dụng

\`\`\`bash

# Development mode

npm run start:dev

# Production mode

npm run build
npm run start:prod
\`\`\`

Ứng dụng sẽ chạy tại:

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api/docs

## 📚 API Documentation

### Base URL

\`\`\`
http://localhost:3000
\`\`\`

### Authentication Endpoints

#### 1. Đăng ký tài khoản

\`\`\`http
POST /auth/register
Content-Type: application/json

{
"email": "user@example.com",
"firstName": "Nguyễn",
"lastName": "Văn A",
"password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "123e4567-e89b-12d3-a456-426614174000",
"email": "user@example.com",
"firstName": "Nguyễn",
"lastName": "Văn A",
"role": "user",
"isActive": true,
"createdAt": "2024-01-01T00:00:00.000Z",
"updatedAt": "2024-01-01T00:00:00.000Z"
}
}
\`\`\`

#### 2. Đăng nhập

\`\`\`http
POST /auth/login
Content-Type: application/json

{
"email": "user@example.com",
"password": "password123"
}
\`\`\`

#### 3. Lấy thông tin profile

\`\`\`http
GET /auth/profile
Authorization: Bearer <your-jwt-token>
\`\`\`

### User Management Endpoints

#### 1. Lấy danh sách người dùng

\`\`\`http
GET /users
Authorization: Bearer <your-jwt-token>
\`\`\`

#### 2. Lấy thông tin người dùng theo ID

\`\`\`http
GET /users/{id}
Authorization: Bearer <your-jwt-token>
\`\`\`

#### 3. Cập nhật thông tin người dùng

\`\`\`http
PATCH /users/{id}
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
"firstName": "Nguyễn",
"lastName": "Văn B",
"isActive": true
}
\`\`\`

#### 4. Xóa người dùng

\`\`\`http
DELETE /users/{id}
Authorization: Bearer <your-jwt-token>
\`\`\`

## 🧪 Testing với Swagger

1. Truy cập http://localhost:3000/api/docs
2. Thử endpoint `/auth/register` để tạo tài khoản
3. Thử endpoint `/auth/login` để lấy JWT token
4. Click nút "Authorize" và nhập token theo format: \`Bearer <your-token>\`
5. Test các endpoint khác với token đã xác thực

## 🗃️ Cấu trúc Database

### Users Table

\`\`\`sql
CREATE TABLE users (
id VARCHAR(36) PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
firstName VARCHAR(255) NOT NULL,
lastName VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
role ENUM('user', 'admin') DEFAULT 'user',
isActive BOOLEAN DEFAULT true,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

## 🔒 Bảo mật

- **Password Hashing**: Sử dụng bcryptjs với salt rounds = 12
- **JWT**: Token có thời hạn 24h (có thể tùy chỉnh)
- **Validation**: Kiểm tra dữ liệu đầu vào nghiêm ngặt
- **CORS**: Cấu hình cho phép origin cụ thể
- **Guards**: Bảo vệ routes với JWT authentication

## 📁 Cấu trúc project

\`\`\`
src/
├── auth/ # Authentication module
│ ├── dto/ # Data Transfer Objects
│ ├── auth.controller.ts
│ ├── auth.service.ts
│ ├── auth.module.ts
│ ├── jwt.strategy.ts
│ ├── local.strategy.ts
│ ├── jwt-auth.guard.ts
│ └── local-auth.guard.ts
├── user/ # User management module
│ ├── dto/ # Data Transfer Objects
│ ├── user.controller.ts
│ ├── user.service.ts
│ ├── user.module.ts
│ └── user.entity.ts
├── common/ # Shared utilities
│ └── all-exceptions.filter.ts
├── app.module.ts # Root module
└── main.ts # Application entry point
\`\`\`

## 🐛 Troubleshooting

### Lỗi kết nối database

1. Kiểm tra MySQL đã chạy chưa
2. Xác nhận thông tin kết nối trong `.env`
3. Tạo database nếu chưa có

### Lỗi JWT

1. Kiểm tra `JWT_SECRET` trong `.env`
2. Đảm bảo token được gửi đúng format: \`Bearer <token>\`
3. Kiểm tra token chưa hết hạn

### Lỗi validation

1. Kiểm tra dữ liệu gửi đúng format
2. Xem log chi tiết trong console
3. Tham khảo Swagger documentation

## 🔄 Cập nhật và mở rộng

### Thêm module mới

1. Tạo thư mục module trong `src/`
2. Tạo entity, service, controller, dto
3. Import module vào `app.module.ts`

### Thêm validation mới

1. Sử dụng decorators từ `class-validator`
2. Cập nhật DTO tương ứng
3. Test với Swagger

## 👥 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License
