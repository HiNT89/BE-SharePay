import { BaseEntity } from '@/common/base/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('bill')
export class Bill extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', default: 'VND' })
  currency_code: string;

  @Column({ type: 'numeric' })
  total_amount: number;

  @Column({ type: 'text' })
  note: string;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @ManyToOne(() => User, (user) => user.bills)
  @JoinColumn({ name: 'userCreateId' }) // Sửa tên cột ngoại khóa đúng
  user: User;

  @Column({ nullable: true })
  userCreateId: number;
}
