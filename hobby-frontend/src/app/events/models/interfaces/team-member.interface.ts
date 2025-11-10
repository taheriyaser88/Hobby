import { TeamRole } from '../enums';

/**
 * عضو تیم برگزارکننده
 */
export interface TeamMember {
  userId: string | number;      // شناسه کاربر
  role: TeamRole;               // نقش
  permissions: string[];         // دسترسی‌ها
  assignedAt: Date | string;    // زمان انتصاب
}




