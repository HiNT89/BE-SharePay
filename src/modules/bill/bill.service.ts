// Import các decorator và exception từ NestJS
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

// Import TypeORM decorators và classes
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import entity và DTOs

// Import common DTOs cho pagination và response
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  BaseResponseDto,
  PaginatedResponseDto,
  ResponseHelper,
} from '@/common/dto/base-response.dto';

// Import class-transformer để chuyển đổi object
import { plainToClass } from 'class-transformer';
import { Bill } from './bill.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { BillResponseDto } from './dto/bill-response.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

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
export class BillService {
  /**
   * Constructor - Inject User repository để tương tác với database
   */
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
  ) {}

  /**
   * Tạo hóa đơn mới
   *
   * @param createBillDto - Dữ liệu tạo hóa đơn
   * @returns BaseResponseDto<BillResponseDto> - Response có metadata
   * @throws ConflictException - Nếu hóa đơn đã tồn tại
   */
  async create(
    createBillDto: CreateBillDto,
  ): Promise<BaseResponseDto<BillResponseDto>> {
    // Tạo entity mới từ DTO
    const bill = this.billRepository.create(createBillDto);
    const savedBill = await this.billRepository.save(bill);

    // Chuyển đổi entity sang DTO response (loại bỏ sensitive data như password)
    const billResponse = plainToClass(BillResponseDto, savedBill, {
      excludeExtraneousValues: true,
    });

    return ResponseHelper.success(billResponse, 'Tạo hóa đơn thành công', 201);
  }

  /**
   * Tạo hóa đơn mới (sử dụng nội bộ - không có metadata)
   *
   * @param createBillDto - Dữ liệu tạo hóa đơn
   * @returns BillResponseDto - Thông tin hóa đơn đã tạo
   * @throws ConflictException - Nếu hóa đơn đã tồn tại
   */
  async createSimple(createBillDto: CreateBillDto): Promise<BillResponseDto> {
    // Tạo entity mới từ DTO
    const bill = this.billRepository.create(createBillDto);
    const savedBill = await this.billRepository.save(bill);

    // Chuyển đổi entity sang DTO response (loại bỏ sensitive data như password)
    return plainToClass(BillResponseDto, savedBill, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Lấy danh sách tất cả hóa đơn với pagination
   *
   * @param paginationQuery - Query parameters cho pagination
   * @returns PaginatedResponseDto<BillResponseDto> - Danh sách hóa đơn có pagination metadata
   */
  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<BillResponseDto>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = paginationQuery;

    // Build query với pagination và sorting
    const [bills, totalItems] = await this.billRepository.findAndCount({
      order: { [sortBy]: sortOrder },
      skip: paginationQuery.offset,
      take: limit,
    });

    // Chuyển đổi từng entity sang DTO response
    const billResponses = bills.map((bill) =>
      plainToClass(BillResponseDto, bill, {
        excludeExtraneousValues: true,
      }),
    );

    return ResponseHelper.paginated(
      billResponses,
      page,
      limit,
      totalItems,
      'Lấy danh sách hóa đơn thành công',
    );
  }

  /**
   * Tìm hóa đơn theo ID (sử dụng nội bộ)
      userResponses,
      page,
      limit,
      totalItems,
      'Lấy danh sách hóa đơn thành công',
    );
  }

  /**
   * Tìm hóa đơn theo ID (sử dụng nội bộ)
   *
   * @param id - ID của người dùng
   * @returns User entity hoặc null nếu không tìm thấy
   * @throws BadRequestException - Nếu ID không hợp lệ
   */
  async findById(id: number): Promise<Bill | null> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID hóa đơn không hợp lệ');
    }

    return this.billRepository.findOne({
      where: { id },
    });
  }

  /**
   * Lấy thông tin chi tiết một hóa đơn (public API)
   *
   * @param id - ID của hóa đơn
   * @returns BaseResponseDto<BillResponseDto> - Thông tin hóa đơn có metadata
   * @throws NotFoundException - Nếu không tìm thấy hóa đơn
   */
  async findOne(id: number): Promise<BaseResponseDto<BillResponseDto>> {
    const bill = await this.findById(id);

    if (!bill) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    // Chuyển đổi entity sang DTO response
    const billResponse = plainToClass(BillResponseDto, bill, {
      excludeExtraneousValues: true,
    });

    return ResponseHelper.success(
      billResponse,
      'Lấy thông tin hóa đơn thành công',
    );
  }

  /**
   * Lấy thông tin chi tiết một hóa đơn (sử dụng nội bộ - không có metadata)
   *
   * @param id - ID của hóa đơn
   * @returns BillResponseDto - Thông tin hóa đơn đơn giản
   * @throws NotFoundException - Nếu không tìm thấy hóa đơn
   */
  async findOneSimple(id: number): Promise<BillResponseDto> {
    const bill = await this.findById(id);

    if (!bill) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    // Chuyển đổi entity sang DTO response
    return plainToClass(BillResponseDto, bill, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Cập nhật thông tin hóa đơn
   *
   * @param id - ID của hóa đơn cần cập nhật
   * @param updateBillDto - Dữ liệu cập nhật (partial)
   * @returns BaseResponseDto<BillResponseDto> - Thông tin hóa đơn sau khi cập nhật có metadata
   * @throws NotFoundException - Nếu không tìm thấy hóa đơn
   * @throws ConflictException - Nếu email mới đã tồn tại
   */
  async update(
    id: number,
    updateBillDto: UpdateBillDto,
  ): Promise<BaseResponseDto<BillResponseDto>> {
    const bill = await this.findById(id);

    if (!bill) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    // Merge dữ liệu mới vào entity hiện tại
    Object.assign(bill, updateBillDto);
    const updatedBill = await this.billRepository.save(bill);

    // Chuyển đổi entity sang DTO response
    const billResponse = plainToClass(BillResponseDto, updatedBill, {
      excludeExtraneousValues: true,
    });

    return ResponseHelper.success(billResponse, 'Cập nhật hóa đơn thành công');
  }

  /**
   * Xóa mềm hóa đơn khỏi hệ thống
   *
   * @param id - ID của hóa đơn cần xóa
   * @returns BaseResponseDto<null> - Response với metadata xác nhận xóa thành công
   * @throws NotFoundException - Nếu không tìm thấy hóa đơn
   */

  async remove(id: number): Promise<BaseResponseDto<null>> {
    const bill = await this.findById(id);

    if (!bill) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    // Xóa mềm hóa đơn (soft delete)
    await this.billRepository.softRemove(bill);

    return ResponseHelper.success(null, 'Xóa hóa đơn thành công', 204);
  }
}
