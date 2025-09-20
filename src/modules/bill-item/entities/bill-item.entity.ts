import { BaseEntity } from '@/common/base/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('bill-item')
export class BillItem extends BaseEntity {
  @Column({ nullable: true, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'numeric' })
  bill_id: number;

  @Column({ nullable: true, type: 'numeric' })
  price: number;

  @Column({ nullable: true, type: 'numeric' })
  quantity: number;
}
