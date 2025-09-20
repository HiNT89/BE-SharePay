import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsObject,
  ValidateNested,
  MinLength,
  IsUrl,
} from 'class-validator';
import { Type, Exclude, Expose } from 'class-transformer';
import { UserRole } from '../entities/user.entity';
import { BaseResponseDto } from '@/common/base/base.response.dto';

export class BankInfoDto {
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  accountHolderName?: string;

  @IsOptional()
  @IsString()
  bankCode?: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BankInfoDto)
  bankInfo?: BankInfoDto;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BankInfoDto)
  bankInfo?: BankInfoDto;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class UserResponseDto extends BaseResponseDto {
  @Expose()
  email: string;

  @Expose()
  name?: string;

  @Exclude()
  password?: string;

  @Expose()
  bankInfo?: BankInfoDto;

  @Expose()
  role: UserRole;

  @Expose()
  avatarUrl?: string;
}
