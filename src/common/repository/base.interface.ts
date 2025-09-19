import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  QueryRunner,
  SelectQueryBuilder,
} from 'typeorm';

interface HasId {
  id: number | string;
}

/**
 * Contract chung cho repository.
 * Dùng để đảm bảo tính thống nhất giữa các repository cụ thể.
 */
export interface BaseInterfaceRepository<T extends HasId> {
  /** --- Create / Save --- */
  save(data: DeepPartial<T>, queryRunner?: QueryRunner): Promise<T>;
  saveMany(data: DeepPartial<T>[], queryRunner?: QueryRunner): Promise<T[]>;
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];

  /** --- Read --- */
  findOneById(id: T['id'], queryRunner?: QueryRunner): Promise<T | null>;
  findByCondition(
    options: FindOneOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<T | null>;
  findWithRelations(
    options: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<T[]>;
  findAll(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<T[]>;
  findAndCount(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<[T[], number]>;
  count(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<number>;
  exist(
    where: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<boolean>;

  /** --- Update --- */
  update(
    where: FindOptionsWhere<T>,
    partial: Partial<T>,
    queryRunner?: QueryRunner,
  ): Promise<any>;

  /** --- Delete --- */
  remove(entity: T, queryRunner?: QueryRunner): Promise<T>;
  deleteById(id: T['id'], queryRunner?: QueryRunner): Promise<any>;

  /** --- preload --- */
  preload(
    entityLike: DeepPartial<T>,
    queryRunner?: QueryRunner,
  ): Promise<T | null>;

  /** --- Alias --- */
  findOne(
    options: FindOneOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<T | null>;

  /** --- QueryBuilder --- */
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T>;
  /** --- Upsert --- */
  upsert(
    data: DeepPartial<T> | DeepPartial<T>[],
    conflictPaths: (keyof T)[],
    queryRunner?: QueryRunner,
  ): Promise<InsertResult>;
}
