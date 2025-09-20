import { BaseEntity } from '@/common/base/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('paid')
export class Paid extends BaseEntity {
  @Column({ nullable: true, type: 'numeric' })
  user_id: number;

  @Column({ nullable: true, type: 'numeric' })
  bill_item_id: number;

  @Column({ nullable: true, type: 'numeric', precision: 5, scale: 2 })
  percent: number;

  @Column({ nullable: true, type: 'numeric' })
  amount: number;
}
