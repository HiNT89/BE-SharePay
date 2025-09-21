import { BaseAbstractEntity } from './base.entity';

export class BaseDto {
  id!: number;

  createdAt!: Date;

  updatedAt!: Date;

  isActive!: boolean;

  constructor(
    entity: BaseAbstractEntity,
    options?: { excludeFields?: boolean },
  ) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
      this.isActive = entity.isActive;
    }
  }
}
