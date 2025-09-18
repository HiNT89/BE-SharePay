// Import các decorator từ TypeORM để định nghĩa entity và quan hệ
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
 * Entity Bill - Đại diện cho bảng bills (hóa đơn) trong database
 *
 * Chức năng:
 * - Lưu trữ thông tin hóa đơn chi tiêu
 * - Quản lý thông tin thanh toán và chia sẻ chi phí
 * - Liên kết với nhiều người dùng thông qua quan hệ Many-to-Many
 * - Hỗ trợ soft delete và tracking thời gian
 */
@Entity('bills') // Tên bảng trong database
export class Bill {
  /**
   * ID duy nhất của hóa đơn - Primary key tự động tăng
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Tiêu đề/tên của hóa đơn
   * Ví dụ: "Ăn trưa nhà hàng ABC", "Mua sắm siêu thị"
   */
  @Column()
  title: string;

  /**
   * Tổng số tiền của hóa đơn
   * Lưu trữ dưới dạng số (có thể là decimal/float)
   */
  @Column()
  total_amount: number;

  /**
   * Mã đơn vị tiền tệ
   * Mặc định là 'VND' (Việt Nam Đồng)
   * Có thể là USD, EUR, JPY, etc.
   */
  @Column({ nullable: true, default: 'VND' })
  currency_code: string;

  /**
   * Trạng thái hoạt động của hóa đơn
   * true: đang hoạt động, false: bị vô hiệu hóa
   * Mặc định là true
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Thời gian tạo hóa đơn - tự động sinh khi tạo record
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Thời gian cập nhật cuối cùng - tự động cập nhật khi modify
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Thời gian xóa mềm (soft delete)
   * null: chưa bị xóa, có giá trị: đã bị xóa vào thời điểm này
   */
  @DeleteDateColumn()
  deletedAt?: Date;

  /**
   * Ngày phát sinh hóa đơn (ngày thực tế chi tiêu)
   * Định dạng: YYYY-MM-DD
   * Khác với createdAt (thời gian tạo record trong hệ thống)
   */
  @Column({ type: 'date', nullable: true })
  bill_date?: Date;

  /**
   * Ghi chú bổ sung về hóa đơn
   * Có thể chứa thông tin chi tiết về mục đích chi tiêu,
   * cách thức chia sẻ, hoặc bất kỳ lưu ý nào khác
   */
  @Column({ type: 'text', nullable: true })
  note?: string;

  /**
   * URL hình ảnh hóa đơn gốc
   * Dùng để lưu trữ ảnh chụp hóa đơn thực tế làm bằng chứng
   */
  @Column({ type: 'text', nullable: true })
  image_url?: string;

  /**
   * ID của người dùng tạo hóa đơn
   * Foreign key liên kết với bảng users
   * Xác định người chịu trách nhiệm chính về hóa đơn này
   */
  @Column()
  user_id: number;

  /**
   * Danh sách người dùng tham gia chia sẻ hóa đơn
   * Quan hệ Many-to-Many: một hóa đơn có thể có nhiều người tham gia,
   * một người có thể tham gia nhiều hóa đơn khác nhau
   */
  @ManyToMany(() => User, (u) => u.bills)
  users: User[];
}
