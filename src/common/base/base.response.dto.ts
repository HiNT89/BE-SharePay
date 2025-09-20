import { Expose } from 'class-transformer';

export class BaseResponseDto {
  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updateAt: Date;

  @Expose()
  id: number;
}
