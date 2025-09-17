import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email } = createUserDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    return plainToClass(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });

    return users.map((user) =>
      plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findById(id: string): Promise<User | null> {
    if (!id) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra email mới đã tồn tại (nếu có thay đổi)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    // Loại bỏ password khỏi updateUserDto nếu có
    const { password, ...updateData } = updateUserDto;

    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);

    return plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    await this.userRepository.remove(user);
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }
}
