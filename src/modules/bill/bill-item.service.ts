import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BillItemEntity } from './entities/bill-item.entity';
import {
  CreateBillItemDto,
  UpdateBillItemDto,
  BillItemResponseDto,
} from './dto/bill-item.dto';
import { BillItemRepository } from './bill-item.repository';
import {
  BaseResponseDto,
  RESPONSE_MESSAGES,
  ResponseStatus,
  ResponseCode,
} from '@/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BillItemService {
  constructor(private readonly billItemRepository: BillItemRepository) {}

  /**
   * Tạo mới một bill item
   */
  async create(
    createBillItemDto: CreateBillItemDto,
  ): Promise<BaseResponseDto<BillItemResponseDto>> {
    try {
      // Tính total_amount
      const total_amount = this.calculateTotalAmount(
        createBillItemDto.unit_price,
        createBillItemDto.quantity,
        createBillItemDto.discount || 0,
        createBillItemDto.discount_percent || 0,
      );

      const billItemData = {
        ...createBillItemDto,
        total_amount,
      };

      const billItem = await this.billItemRepository.save(billItemData);

      return BaseResponseDto.success(
        plainToInstance(BillItemResponseDto, billItem),
        RESPONSE_MESSAGES.CREATED_SUCCESS,
        ResponseCode.CREATED,
      );
    } catch (error) {
      throw new BadRequestException(
        `Không thể tạo bill item: ${error.message}`,
      );
    }
  }

  /**
   * Cập nhật bill item
   */
  async update(
    id: number,
    updateBillItemDto: UpdateBillItemDto,
  ): Promise<BaseResponseDto<BillItemResponseDto>> {
    const billItem = await this.billItemRepository.findOne({ where: { id } });
    if (!billItem) {
      throw new NotFoundException('Không tìm thấy bill item');
    }

    // Cập nhật các field
    Object.assign(billItem, updateBillItemDto);

    // Tính lại total_amount nếu có thay đổi
    if (
      updateBillItemDto.unit_price !== undefined ||
      updateBillItemDto.quantity !== undefined ||
      updateBillItemDto.discount !== undefined ||
      updateBillItemDto.discount_percent !== undefined
    ) {
      billItem.total_amount = this.calculateTotalAmount(
        billItem.unit_price,
        billItem.quantity,
        billItem.discount || 0,
        billItem.discount_percent || 0,
      );
    }

    const updatedBillItem = await this.billItemRepository.save(billItem);

    return BaseResponseDto.success(
      plainToInstance(BillItemResponseDto, updatedBillItem),
      RESPONSE_MESSAGES.UPDATED_SUCCESS,
    );
  }

  /**
   * Lấy thông tin bill item theo ID
   */
  async findOne(id: number): Promise<BaseResponseDto<BillItemResponseDto>> {
    const billItem = await this.billItemRepository.findOne({ where: { id } });
    if (!billItem) {
      throw new NotFoundException('Không tìm thấy bill item');
    }

    return BaseResponseDto.success(
      plainToInstance(BillItemResponseDto, billItem),
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  /**
   * Lấy tất cả items của một bill
   */
  async findByBillId(
    billId: number,
  ): Promise<BaseResponseDto<BillItemResponseDto[]>> {
    const billItems = await this.billItemRepository.findByBillId(billId);

    return BaseResponseDto.success(
      plainToInstance(BillItemResponseDto, billItems),
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  /**
   * Xóa bill item
   */
  async remove(id: number): Promise<BaseResponseDto<void>> {
    const billItem = await this.billItemRepository.findOne({ where: { id } });
    if (!billItem) {
      throw new NotFoundException('Không tìm thấy bill item');
    }

    await this.billItemRepository.deleteById(id);

    return BaseResponseDto.success(
      undefined,
      RESPONSE_MESSAGES.DELETED_SUCCESS,
    );
  }

  /**
   * Tính tổng tiền của các items trong một bill
   */
  async getTotalAmountByBillId(billId: number): Promise<number> {
    return this.billItemRepository.getTotalAmountByBillId(billId);
  }

  /**
   * Tính total_amount dựa trên unit_price, quantity, discount
   */
  private calculateTotalAmount(
    unitPrice: number,
    quantity: number,
    discount: number = 0,
    discountPercent: number = 0,
  ): number {
    const subtotal = unitPrice * quantity;
    let totalDiscount = discount;

    // Nếu có discount_percent thì tính discount từ %
    if (discountPercent > 0) {
      totalDiscount += (subtotal * discountPercent) / 100;
    }

    return Math.max(0, subtotal - totalDiscount);
  }
}
