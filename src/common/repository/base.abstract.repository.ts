import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { BaseInterfaceRepository } from './base.interface';

interface HasId {
  id: number | string;
}

/**
 * Base repository chuẩn hoá thao tác CRUD và cung cấp helper cho QueryRunner.
 * Cung cấp các phương thức cơ bản cho tất cả repository entity.
 *
 * @template T - Entity type phải có thuộc tính id
 */
export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  protected readonly repo: Repository<T>;

  protected constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  /** --- Helpers --- */
  /**
   * Lấy repository instance, hỗ trợ QueryRunner cho transaction
   * @param queryRunner - QueryRunner instance (tùy chọn)
   * @returns Repository instance
   */
  protected getRepo(queryRunner?: QueryRunner): Repository<T> {
    return queryRunner
      ? queryRunner.manager.getRepository(this.repo.target)
      : this.repo;
  }

  /** --- Create / Save --- */
  /**
   * Lưu một entity vào database
   * @param data - Dữ liệu entity để lưu
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T> Entity đã được lưu
   */
  public save(data: DeepPartial<T>, queryRunner?: QueryRunner): Promise<T> {
    return this.getRepo(queryRunner).save(data);
  }

  /**
   * Lưu nhiều entity vào database
   * @param data - Mảng dữ liệu entity để lưu
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T[]> Mảng entity đã được lưu
   */
  public saveMany(
    data: DeepPartial<T>[],
    queryRunner?: QueryRunner,
  ): Promise<T[]> {
    return this.getRepo(queryRunner).save(data);
  }

  /**
   * Tạo instance entity mới (chưa lưu vào DB)
   * @param data - Dữ liệu entity
   * @returns T Entity instance
   */
  public create(data: DeepPartial<T>): T {
    return this.repo.create(data);
  }

  /**
   * Tạo nhiều instance entity mới (chưa lưu vào DB)
   * @param data - Mảng dữ liệu entity
   * @returns T[] Mảng entity instance
   */
  public createMany(data: DeepPartial<T>[]): T[] {
    return this.repo.create(data);
  }

  /**
   * Merge dữ liệu vào entity target
   * @param target - Entity target
   * @param sources - Dữ liệu để merge
   * @returns T Entity đã được merge
   */
  public merge(target: T, ...sources: DeepPartial<T>[]): T {
    return this.repo.merge(target, ...sources);
  }

  /** --- Read --- */
  /**
   * Tìm entity theo ID
   * @param id - ID của entity
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T | null> Entity hoặc null nếu không tìm thấy
   */
  public findOneById(
    id: T['id'],
    queryRunner?: QueryRunner,
  ): Promise<T | null> {
    const where: FindOptionsWhere<T> = { id } as unknown as FindOptionsWhere<T>;
    return this.getRepo(queryRunner).findOneBy(where);
  }

  /**
   * Tìm entity theo điều kiện
   * @param options - Tùy chọn tìm kiếm
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T | null> Entity hoặc null nếu không tìm thấy
   */
  public findByCondition(
    options: FindOneOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<T | null> {
    return this.getRepo(queryRunner).findOne(options);
  }

  /**
   * Tìm entity kèm theo relations
   * @param options - Tùy chọn tìm kiếm kèm relations
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T[]> Mảng entity
   */
  public findWithRelations(
    options: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<T[]> {
    return this.getRepo(queryRunner).find(options);
  }

  /**
   * Tìm tất cả entity
   * @param options - Tùy chọn tìm kiếm (tùy chọn)
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T[]> Mảng entity
   */
  public findAll(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<T[]> {
    return this.getRepo(queryRunner).find(options);
  }

  /**
   * Tìm entity và đếm tổng số
   * @param options - Tùy chọn tìm kiếm (tùy chọn)
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<[T[], number]> Tuple [entities, total count]
   */
  public findAndCount(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<[T[], number]> {
    return this.getRepo(queryRunner).findAndCount(options);
  }

  /**
   * Đếm số lượng entity
   * @param options - Tùy chọn đếm (tùy chọn)
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<number> Số lượng entity
   */
  public count(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    return this.getRepo(queryRunner).count(options);
  }

  /**
   * Kiểm tra entity có tồn tại
   * @param where - Điều kiện kiểm tra
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<boolean> True nếu tồn tại
   */
  public exist(
    where: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    return this.getRepo(queryRunner).exist({ where });
  }

  /** --- Update / Upsert --- */
  /**
   * Cập nhật entity theo điều kiện
   * @param where - Điều kiện tìm entity để cập nhật
   * @param partial - Dữ liệu cập nhật
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<UpdateResult> Kết quả cập nhật
   */
  public update(
    where: FindOptionsWhere<T>,
    partial: Partial<T>,
    queryRunner?: QueryRunner,
  ): Promise<UpdateResult> {
    return this.getRepo(queryRunner).update(where, partial as any);
  }

  /**
   * Upsert entity (insert hoặc update nếu đã tồn tại)
   * @param data - Dữ liệu entity
   * @param conflictPaths - Các trường conflict để xác định duplicate
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<InsertResult> Kết quả insert
   */
  public upsert(
    data: DeepPartial<T> | DeepPartial<T>[],
    conflictPaths: (keyof T)[],
    queryRunner?: QueryRunner,
  ): Promise<InsertResult> {
    return this.getRepo(queryRunner).upsert(
      data as any,
      conflictPaths as string[],
    );
  }

  /** --- Delete / Soft delete --- */
  /**
   * Xóa entity instance khỏi database
   * @param entity - Entity instance để xóa
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T> Entity đã bị xóa
   */
  public remove(entity: T, queryRunner?: QueryRunner): Promise<T> {
    return this.getRepo(queryRunner).remove(entity);
  }

  /**
   * Xóa entity theo ID
   * @param id - ID của entity cần xóa
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<DeleteResult> Kết quả xóa
   */
  public deleteById(
    id: T['id'],
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    return this.getRepo(queryRunner).delete({ id } as any);
  }

  /**
   * Soft delete entity (đánh dấu là đã xóa nhưng không xóa khỏi DB)
   * @param where - Điều kiện tìm entity để soft delete
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<UpdateResult> Kết quả soft delete
   */
  public softDelete(
    where: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<UpdateResult> {
    return this.getRepo(queryRunner).softDelete(where);
  }

  /**
   * Khôi phục entity đã bị soft delete
   * @param where - Điều kiện tìm entity để khôi phục
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<UpdateResult> Kết quả khôi phục
   */
  public restore(
    where: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<UpdateResult> {
    return this.getRepo(queryRunner).restore(where);
  }

  /** --- preload --- */
  /**
   * Preload entity - load entity với một số thuộc tính và apply validation
   * @param entityLike - Dữ liệu entity-like để preload
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T | null> Entity đã được preload hoặc null
   */
  public preload(
    entityLike: DeepPartial<T>,
    queryRunner?: QueryRunner,
  ): Promise<T | null> {
    return this.getRepo(queryRunner)
      .preload(entityLike)
      .then((result) => result || null);
  }

  /** --- findOne alias --- */
  /**
   * Alias cho findByCondition - tìm một entity theo tùy chọn
   * @param options - Tùy chọn tìm kiếm
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns Promise<T | null> Entity hoặc null nếu không tìm thấy
   */
  public findOne(
    options: FindOneOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<T | null> {
    return this.getRepo(queryRunner).findOne(options);
  }

  /** --- QueryBuilder --- */
  /**
   * Tạo QueryBuilder để build query phức tạp
   * @param alias - Alias cho entity trong query (tùy chọn)
   * @param queryRunner - QueryRunner cho transaction (tùy chọn)
   * @returns SelectQueryBuilder<T> Query builder instance
   */
  public createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    return this.getRepo(queryRunner).createQueryBuilder(alias);
  }
}
