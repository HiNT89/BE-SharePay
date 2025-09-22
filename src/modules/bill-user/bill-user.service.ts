import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { BillUserRepository } from './bill-user.repository';
import { BillRepository } from '../bill/bill.repository';
import { UserRepository } from '../user/user.repository';
import {
  CreateBillUserDto,
  UpdateBillUserDto,
  MarkPaidDto,
  BillUserResponseDto,
  SplitBillDto,
} from './dto/bill-user.dto';
import { BaseResponseDto, RESPONSE_MESSAGES } from '@/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BillUserService {
  constructor(
    private readonly billUserRepository: BillUserRepository,
    private readonly billRepository: BillRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Thêm user vào hóa đơn
   */
  async addUserToBill(
    createBillUserDto: CreateBillUserDto,
  ): Promise<BaseResponseDto<BillUserResponseDto | null>> {
    const { billId, userId } = createBillUserDto;

    // Kiểm tra bill có tồn tại không
    const bill = await this.billRepository.findOne({
      where: { id: billId, isActive: true },
    });
    if (!bill) {
      throw new NotFoundException('Hóa đơn không tồn tại');
    }

    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Kiểm tra quan hệ đã tồn tại chưa
    const existingBillUser = await this.billUserRepository.findByBillAndUser(
      billId,
      userId,
    );
    if (existingBillUser) {
      throw new ConflictException('Người dùng đã được thêm vào hóa đơn này');
    }

    const result = await this.billUserRepository.save(createBillUserDto);

    const transformedData = plainToInstance(BillUserResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.success(
      transformedData,
      RESPONSE_MESSAGES.CREATED_SUCCESS,
    );
  }

  /**
   * Chia hóa đơn cho nhiều người
   */
  async splitBill(
    splitBillDto: SplitBillDto,
  ): Promise<BaseResponseDto<BillUserResponseDto[]>> {
    const { billId, users } = splitBillDto;

    // Kiểm tra bill có tồn tại không
    const bill = await this.billRepository.findOne({
      where: { id: billId, isActive: true },
    });
    if (!bill) {
      throw new NotFoundException('Hóa đơn không tồn tại');
    }

    // Tính tổng số tiền được chia
    const totalSplitAmount = users.reduce(
      (sum, user) => sum + user.amount_to_pay,
      0,
    );

    // Kiểm tra tổng số tiền có vượt quá tổng tiền hóa đơn không
    if (totalSplitAmount > bill.total_amount) {
      throw new BadRequestException(
        'Tổng số tiền chia không được vượt quá tổng tiền hóa đơn',
      );
    }

    const results: any[] = [];

    // Thêm từng user vào hóa đơn
    for (const userData of users) {
      // Kiểm tra user có tồn tại không
      const user = await this.userRepository.findOne({
        where: { id: userData.userId, isActive: true },
      });
      if (!user) {
        throw new NotFoundException(
          `Người dùng ID ${userData.userId} không tồn tại`,
        );
      }

      // Kiểm tra quan hệ đã tồn tại chưa
      const existingBillUser = await this.billUserRepository.findByBillAndUser(
        billId,
        userData.userId,
      );
      if (existingBillUser) {
        // Cập nhật nếu đã tồn tại
        existingBillUser.amount_to_pay = userData.amount_to_pay;
        existingBillUser.payment_note = userData.payment_note;
        const updatedResult =
          await this.billUserRepository.save(existingBillUser);
        results.push(updatedResult);
      } else {
        // Tạo mới nếu chưa tồn tại
        const newBillUser = {
          billId,
          userId: userData.userId,
          amount_to_pay: userData.amount_to_pay,
          payment_note: userData.payment_note,
        };
        const newResult = await this.billUserRepository.save(newBillUser);
        results.push(newResult);
      }
    }

    const transformedData = plainToInstance(BillUserResponseDto, results, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.success(transformedData, 'Chia hóa đơn thành công');
  }

  /**
   * Đánh dấu đã thanh toán
   */
  async markAsPaid(
    billId: number,
    userId: number,
    markPaidDto: MarkPaidDto,
  ): Promise<BaseResponseDto<BillUserResponseDto | null>> {
    const billUser = await this.billUserRepository.findByBillAndUser(
      billId,
      userId,
    );
    if (!billUser) {
      throw new NotFoundException('Không tìm thấy quan hệ hóa đơn-người dùng');
    }

    billUser.is_paid = true;
    billUser.paid_at = new Date();
    if (markPaidDto.payment_note) {
      billUser.payment_note = markPaidDto.payment_note;
    }

    const result = await this.billUserRepository.save(billUser);

    const transformedData = plainToInstance(BillUserResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.success(
      transformedData,
      'Đánh dấu thanh toán thành công',
    );
  }

  /**
   * Cập nhật thông tin thanh toán
   */
  async updateBillUser(
    billId: number,
    userId: number,
    updateBillUserDto: UpdateBillUserDto,
  ): Promise<BaseResponseDto<BillUserResponseDto | null>> {
    const billUser = await this.billUserRepository.findByBillAndUser(
      billId,
      userId,
    );
    if (!billUser) {
      throw new NotFoundException('Không tìm thấy quan hệ hóa đơn-người dùng');
    }

    // Cập nhật các field
    Object.assign(billUser, updateBillUserDto);

    // Nếu đánh dấu đã thanh toán và chưa có ngày thanh toán thì set ngày hiện tại
    if (
      updateBillUserDto.is_paid &&
      !billUser.paid_at &&
      !updateBillUserDto.paid_at
    ) {
      billUser.paid_at = new Date();
    }

    // Nếu đánh dấu chưa thanh toán thì xóa ngày thanh toán
    if (updateBillUserDto.is_paid === false) {
      billUser.paid_at = undefined;
    }

    const result = await this.billUserRepository.save(billUser);

    const transformedData = plainToInstance(BillUserResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.success(
      transformedData,
      RESPONSE_MESSAGES.UPDATED_SUCCESS,
    );
  }

  /**
   * Lấy danh sách người dùng trong hóa đơn
   */
  async getUsersInBill(
    billId: number,
  ): Promise<BaseResponseDto<BillUserResponseDto[]>> {
    const billUsers = await this.billUserRepository.findUsersByBillId(billId);

    const transformedData = plainToInstance(BillUserResponseDto, billUsers, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.success(
      transformedData,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  /**
   * Lấy danh sách hóa đơn của người dùng
   */
  async getBillsOfUser(
    userId: number,
  ): Promise<BaseResponseDto<BillUserResponseDto[]>> {
    const billUsers = await this.billUserRepository.findBillsByUserId(userId);

    const transformedData = plainToInstance(BillUserResponseDto, billUsers, {
      excludeExtraneousValues: true,
    });

    return BaseResponseDto.success(
      transformedData,
      RESPONSE_MESSAGES.RETRIEVED_SUCCESS,
    );
  }

  /**
   * Xóa user khỏi hóa đơn
   */
  async removeUserFromBill(
    billId: number,
    userId: number,
  ): Promise<BaseResponseDto<boolean>> {
    const billUser = await this.billUserRepository.findByBillAndUser(
      billId,
      userId,
    );
    if (!billUser) {
      throw new NotFoundException('Không tìm thấy quan hệ hóa đơn-người dùng');
    }

    billUser.isActive = false;
    await this.billUserRepository.save(billUser);

    return BaseResponseDto.success(
      true,
      'Xóa người dùng khỏi hóa đơn thành công',
    );
  }

  /**
   * Lấy thống kê thanh toán của hóa đơn
   */
  async getBillPaymentStats(billId: number) {
    const totalPaid =
      await this.billUserRepository.getTotalPaidAmountByBillId(billId);
    const totalUnpaid =
      await this.billUserRepository.getTotalUnpaidAmountByBillId(billId);
    const unpaidUsers =
      await this.billUserRepository.findUnpaidUsersByBillId(billId);

    return BaseResponseDto.success(
      {
        totalPaid,
        totalUnpaid,
        unpaidUsersCount: unpaidUsers.length,
        unpaidUsers: unpaidUsers.map((bu) => ({
          userId: bu.userId,
          userName: bu.user?.name,
          userEmail: bu.user?.email,
          amountToPay: bu.amount_to_pay,
        })),
      },
      'Lấy thống kê thành công',
    );
  }
}
