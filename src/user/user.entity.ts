// Import các decorator từ TypeORM để định nghĩa entity
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

// Import bcrypt để hash password
import * as bcrypt from 'bcryptjs';

// Import class-transformer để loại bỏ sensitive data
import { Exclude } from 'class-transformer';

/**
 * Enum định nghĩa các vai trò người dùng trong hệ thống
 */
export enum UserRole {
  USER = 'user', // Người dùng thông thường
  ADMIN = 'admin', // Quản trị viên
}

/**
 * Entity User - Đại diện cho bảng users trong database
 *
 * Chức năng:
 * - Lưu trữ thông tin người dùng
 * - Tự động hash password trước khi lưu
 * - Validate password khi đăng nhập
 * - Quản lý vai trò và trạng thái người dùng
 */
@Entity('users') // Tên bảng trong database
export class User {
  /**
   * Primary key - ID tự tăng
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Email của người dùng - phải duy nhất trong hệ thống
   */
  @Column({ unique: true })
  email: string;

  /**
   * Tên của người dùng
   */
  @Column()
  firstName: string;

  /**
   * Họ của người dùng
   */
  @Column()
  lastName: string;

  /**
   * Password đã được hash
   * @Exclude() - Loại bỏ khỏi response JSON để bảo mật
   */
  @Column()
  @Exclude()
  password: string;

  /**
   * Vai trò của người dùng trong hệ thống
   * Mặc định là USER
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  /**
   * Trạng thái hoạt động của tài khoản
   * Mặc định là true (đang hoạt động)
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Thời gian tạo tài khoản - tự động sinh
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Thời gian cập nhật cuối cùng - tự động cập nhật
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Thời gian xóa mềm - null nếu chưa bị xóa
   */
  @DeleteDateColumn()
  deletedAt?: Date;

  /**
   * Hook tự động hash password trước khi insert hoặc update
   * Được gọi tự động bởi TypeORM trước khi lưu vào database
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      // Hash password với salt rounds = 12 (mức độ bảo mật cao)
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  /**
   * Kiểm tra password người dùng nhập có khớp với password đã hash không
   *
   * @param password - Password thô từ người dùng
   * @returns boolean - true nếu password đúng, false nếu sai
   */
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
