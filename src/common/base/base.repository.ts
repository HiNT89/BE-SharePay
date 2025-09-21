import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseInterfaceRepository } from './base.interface';

interface HasId {
  id: number;
}

/**
 * Abstract base repository class providing common database operations for entities with ID.
 * Lớp repository cơ sở trừu tượng cung cấp các thao tác cơ sở dữ liệu chung cho các entity có ID.
 *
 * @template T - Entity type that extends HasId interface
 *               Kiểu entity kế thừa từ interface HasId
 */
export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  /**
   * TypeORM repository instance for database operations.
   * Instance repository TypeORM để thực hiện các thao tác cơ sở dữ liệu.
   */
  protected readonly repository: Repository<T>;

  /**
   * Protected constructor to initialize the repository.
   * Constructor được bảo vệ để khởi tạo repository.
   *
   * @param repository - TypeORM repository instance
   *                     Instance repository TypeORM
   */
  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  /**
   * Saves a single entity to the database.
   * Lưu một entity vào cơ sở dữ liệu.
   *
   * @param data - Partial entity data to save
   *               Dữ liệu entity một phần để lưu
   * @returns Promise resolving to the saved entity
   *          Promise trả về entity đã được lưu
   */
  public async save(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }

  /**
   * Saves multiple entities to the database.
   * Lưu nhiều entity vào cơ sở dữ liệu.
   *
   * @param data - Array of partial entity data to save
   *               Mảng dữ liệu entity một phần để lưu
   * @returns Promise resolving to array of saved entities
   *          Promise trả về mảng các entity đã được lưu
   */
  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.save(data);
  }

  /**
   * Creates a new entity instance without saving to database.
   * Tạo một instance entity mới mà không lưu vào cơ sở dữ liệu.
   *
   * @param data - Partial entity data to create
   *               Dữ liệu entity một phần để tạo
   * @returns New entity instance
   *          Instance entity mới
   */
  public create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  /**
   * Creates multiple entity instances without saving to database.
   * Tạo nhiều instance entity mà không lưu vào cơ sở dữ liệu.
   *
   * @param data - Array of partial entity data to create
   *               Mảng dữ liệu entity một phần để tạo
   * @returns Array of new entity instances
   *          Mảng các instance entity mới
   */
  public createMany(data: DeepPartial<T>[]): T[] {
    return this.repository.create(data);
  }

  /**
   * Finds a single entity by its ID.
   * Tìm một entity duy nhất theo ID của nó.
   *
   * @param id - Entity ID to search for
   *             ID entity để tìm kiếm
   * @returns Promise resolving to found entity or null if not found
   *          Promise trả về entity được tìm thấy hoặc null nếu không tìm thấy
   */
  public async findOneById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  /**
   * Finds a single entity based on specified conditions.
   * Tìm một entity duy nhất dựa trên các điều kiện được chỉ định.
   *
   * @param filterCondition - Find options with conditions
   *                          Tùy chọn tìm kiếm với điều kiện
   * @returns Promise resolving to found entity or null if not found
   *          Promise trả về entity được tìm thấy hoặc null nếu không tìm thấy
   */
  public async findByCondition(
    filterCondition: FindOneOptions<T>,
  ): Promise<T | null> {
    return this.repository.findOne(filterCondition);
  }

  /**
   * Finds multiple entities with specified relations and options.
   * Tìm nhiều entity với các quan hệ và tùy chọn được chỉ định.
   *
   * @param options - Find options including relations
   *                  Tùy chọn tìm kiếm bao gồm các quan hệ
   * @returns Promise resolving to array of found entities
   *          Promise trả về mảng các entity được tìm thấy
   */
  public async findWithRelations(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  /**
   * Finds all entities with optional conditions.
   * Tìm tất cả entity với điều kiện tùy chọn.
   *
   * @param options - Optional find options
   *                  Tùy chọn tìm kiếm tùy chọn
   * @returns Promise resolving to array of all entities
   *          Promise trả về mảng tất cả entity
   */
  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  /**
   * Finds a single entity with specified options.
   * Tìm một entity duy nhất với các tùy chọn được chỉ định.
   *
   * @param options - Find options for single entity
   *                  Tùy chọn tìm kiếm cho entity đơn lẻ
   * @returns Promise resolving to found entity or null if not found
   *          Promise trả về entity được tìm thấy hoặc null nếu không tìm thấy
   */
  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  /**
   * Creates a query builder for complex database queries.
   * Tạo query builder cho các truy vấn cơ sở dữ liệu phức tạp.
   *
   * @param alias - Optional table alias for the query
   *                Alias bảng tùy chọn cho truy vấn
   * @param queryRunner - Optional query runner instance
   *                      Instance query runner tùy chọn
   * @returns SelectQueryBuilder instance for building complex queries
   *          Instance SelectQueryBuilder để xây dựng các truy vấn phức tạp
   */
  public createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias, queryRunner);
  }
}
