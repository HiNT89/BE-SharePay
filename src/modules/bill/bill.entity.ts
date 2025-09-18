// Import các decorator từ TypeORM để định nghĩa entity
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '@/modules/user/user.entity';

/**
 * Entity User - Đại diện cho bảng users trong database
 *
 * Chức năng:
 * - Lưu trữ thông tin người dùng
 * - Tự động hash password trước khi lưu
 * - Validate password khi đăng nhập
 * - Quản lý vai trò và trạng thái người dùng
 */
@Entity('bills') // Tên bảng trong database
export class Bill {
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
   * Tiêu đề hóa đơn
   */
  @Column()
  title: string;

  /**
   * Họ của người dùng
   */
  @Column()
  totalAmount: number;

  /**
   * Ảnh đại diện của người dùng
   */
  @Column({ nullable: true, default: 'VND' })
  currencyCode: string;

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
   * Ngày tạo hóa đơn thanh toán
   * Định dạng: YYYY-MM-DD
   */
  @Column({ type: 'date', nullable: true })
  bill_date?: Date;

  /**
   * Ghi chú thêm về hóa đơn
   */
  @Column({ type: 'text', nullable: true })
  note?: string;

  /**
   * Hình ảnh hóa đơn dưới dạng URL
   */
  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  /**
   * ID người dùng tạo hóa đơn
   * Liên kết với bảng users
   */
  @Column()
  userId: number;

  /**
   * Danh sách người dùng liên quan đến hóa đơn
   * Quan hệ Many-to-Many với User entity
   */
  @ManyToMany(() => User, (u) => u.bills)
  users: User[];
}
