import { BaseEntity } from '@/common/base/base.entity';
import { Entity, Column } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  password?: string;

  @Column({ type: 'jsonb', nullable: true })
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
  };

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;
}
