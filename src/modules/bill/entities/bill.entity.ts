import { BaseEntity } from '@/common/base/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('bill')
export class Bill extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'numeric' })
  userCreateId: number;

  @Column({ type: 'text', default: 'VND' })
  currency_code: string;

  @Column({ type: 'numeric' })
  total_amount: number;

  @Column({ type: 'text' })
  note: string;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;
}
