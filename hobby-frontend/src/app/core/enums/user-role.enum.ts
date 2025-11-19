/**
 * User Role Enum
 * نقش‌های کاربری سیستم (انگلیسی برای توسعه‌پذیری بهتر)
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  EVENT_MANAGER = 'EVENT_MANAGER',
  STAFF = 'STAFF',
  USER = 'USER',
}

/**
 * نقش‌های کاربری با عنوان فارسی
 */
export const UserRoleTitle: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'مدیر کل',
  [UserRole.EVENT_MANAGER]: 'مدیر رویداد',
  [UserRole.STAFF]: 'نیروی اجرایی',
  [UserRole.USER]: 'کاربر',
};






