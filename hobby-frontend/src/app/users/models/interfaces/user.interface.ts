import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

/**
 * کاربر سیستم
 */
export interface User {
  id: string | number;
  fullName: string;              // نام کامل
  email: string;                 // ایمیل
  phone?: string;                // شماره تلفن
  role: UserRole;                // نقش کاربر
  status: UserStatus;            // وضعیت کاربر (ACTIVE, INACTIVE, SUSPENDED)
  avatarUrl?: string;            // آواتار
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

