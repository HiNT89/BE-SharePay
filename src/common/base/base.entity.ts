import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

/**
 * Base Entity Class
 * Abstract class chứa các fields cơ bản được sử dụng chung cho tất cả entities
 *
 * Bao gồm:
 * - ID duy nhất tự động tăng
 * - Timestamps cho việc tạo và cập nhật
 * - Trạng thái active/inactive
 *
 * Tất cả entities khác sẽ kế thừa từ class này để có các fields cơ bản
 */
export abstract class BaseAbstractEntity<
  DTO extends BaseDto = BaseDto,
  O = never,
> {
  @ApiProperty({
    description: 'ID duy nhất của bản ghi (tự động tăng)',
    example: 1,
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Thời gian tạo bản ghi',
    example: '2024-01-01T00:00:00Z',
    format: 'date-time',
    readOnly: true,
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật bản ghi gần nhất',
    example: '2024-01-01T12:00:00Z',
    format: 'date-time',
    readOnly: true,
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date; // Fixed typo: updateAt -> updatedAt

  @ApiProperty({
    description: 'Trạng thái hoạt động của bản ghi',
    example: true,
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  toDto(options?: O): DTO {
    const dtoClass = Object.getPrototypeOf(this).dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}
