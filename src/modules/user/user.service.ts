// Import các decorator và exception từ NestJS
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

// Import TypeORM decorators và classes
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import entity và DTOs
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

// Import common DTOs cho pagination và response
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  BaseResponseDto,
  PaginatedResponseDto,
  ResponseHelper,
} from '../../common/dto/base-response.dto';

// Import class-transformer để chuyển đổi object
import { plainToClass } from 'class-transformer';

/**
 * Service xử lý business logic cho quản lý người dùng
 *
 * Chức năng chính:
 * - CRUD operations cho User entity
 * - Validation email duy nhất
 * - Chuyển đổi entity sang DTO response
 * - Quản lý password
 */
@Injectable()
export class UserService {
  /**
   * Constructor - Inject User repository để tương tác với database
   */
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Tạo người dùng mới
   *
   * @param createUserDto - Dữ liệu tạo người dùng
   * @returns BaseResponseDto<UserResponseDto> - Response có metadata
   * @throws ConflictException - Nếu email đã tồn tại
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const { email } = createUserDto;

    // Kiểm tra email đã tồn tại trong database
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Tạo entity mới từ DTO
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    // Chuyển đổi entity sang DTO response (loại bỏ sensitive data như password)
    const userResponse = plainToClass(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });

    return ResponseHelper.success(
      userResponse,
      'Tạo người dùng thành công',
      201,
    );
  }

  /**
   * Tạo người dùng mới (sử dụng nội bộ - không có metadata)
   *
   * @param createUserDto - Dữ liệu tạo người dùng
   * @returns UserResponseDto - Thông tin người dùng đã tạo (không bao gồm password)
   * @throws ConflictException - Nếu email đã tồn tại
   */
  async createSimple(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email } = createUserDto;

    // Kiểm tra email đã tồn tại trong database
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Tạo entity mới từ DTO
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    // Chuyển đổi entity sang DTO response (loại bỏ sensitive data như password)
    return plainToClass(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Lấy danh sách tất cả người dùng với pagination
   *
   * @param paginationQuery - Query parameters cho pagination
   * @returns PaginatedResponseDto<UserResponseDto> - Danh sách người dùng có pagination metadata
   */
  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = paginationQuery;

    // Build query với pagination và sorting
    const [users, totalItems] = await this.userRepository.findAndCount({
      order: { [sortBy]: sortOrder },
      skip: paginationQuery.offset,
      take: limit,
    });

    // Chuyển đổi từng entity sang DTO response
    const userResponses = users.map((user) =>
      plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    );

    return ResponseHelper.paginated(
      userResponses,
      page,
      limit,
      totalItems,
      'Lấy danh sách người dùng thành công',
    );
  }

  /**
   * Tìm người dùng theo ID (sử dụng nội bộ)
   *
   * @param id - ID của người dùng
   * @returns User entity hoặc null nếu không tìm thấy
   * @throws BadRequestException - Nếu ID không hợp lệ
   */
  async findById(id: number): Promise<User | null> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    return this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * Tìm người dùng theo email (sử dụng cho authentication)
   *
   * @param email - Email của người dùng
   * @returns User entity hoặc null nếu không tìm thấy
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Lấy thông tin chi tiết một người dùng (public API)
   *
   * @param id - ID của người dùng
   * @returns BaseResponseDto<UserResponseDto> - Thông tin người dùng có metadata
   * @throws NotFoundException - Nếu không tìm thấy người dùng
   */
  async findOne(id: number): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Chuyển đổi entity sang DTO response
    const userResponse = plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return ResponseHelper.success(
      userResponse,
      'Lấy thông tin người dùng thành công',
    );
  }

  /**
   * Lấy thông tin chi tiết một người dùng (sử dụng nội bộ - không có metadata)
   *
   * @param id - ID của người dùng
   * @returns UserResponseDto - Thông tin người dùng đơn giản
   * @throws NotFoundException - Nếu không tìm thấy người dùng
   */
  async findOneSimple(id: number): Promise<UserResponseDto> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Chuyển đổi entity sang DTO response
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Cập nhật thông tin người dùng
   *
   * @param id - ID của người dùng cần cập nhật
   * @param updateUserDto - Dữ liệu cập nhật (partial)
   * @returns BaseResponseDto<UserResponseDto> - Thông tin người dùng sau khi cập nhật có metadata
   * @throws NotFoundException - Nếu không tìm thấy người dùng
   * @throws ConflictException - Nếu email mới đã tồn tại
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra email mới đã tồn tại (chỉ khi có thay đổi email)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    // Loại bỏ password khỏi updateUserDto để tránh cập nhật password không mong muốn
    const { password, ...updateData } = updateUserDto;

    // Merge dữ liệu mới vào entity hiện tại
    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);

    // Chuyển đổi entity sang DTO response
    const userResponse = plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });

    return ResponseHelper.success(
      userResponse,
      'Cập nhật người dùng thành công',
    );
  }

  /**
   * Xóa mềm người dùng khỏi hệ thống
   *
   * @param id - ID của người dùng cần xóa
   * @returns BaseResponseDto<null> - Response với metadata xác nhận xóa thành công
   * @throws NotFoundException - Nếu không tìm thấy người dùng
   */
  async remove(id: number): Promise<BaseResponseDto<null>> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Xóa mềm người dùng (soft delete)
    await this.userRepository.softRemove(user);

    return ResponseHelper.success(null, 'Xóa người dùng thành công', 204);
  }

  /**
   * Cập nhật password cho người dùng (sử dụng cho authentication)
   *
   * @param id - ID của người dùng
   * @param newPassword - Password mới (đã được hash)
   * @throws NotFoundException - Nếu không tìm thấy người dùng
   */
  async updatePassword(id: number, newPassword: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Cập nhật password (password đã được hash trước khi truyền vào)
    user.password = newPassword;
    await this.userRepository.save(user);
  }
}
