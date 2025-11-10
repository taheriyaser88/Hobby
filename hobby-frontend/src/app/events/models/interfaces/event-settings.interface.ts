import { CustomField } from './custom-field.interface';

/**
 * تنظیمات پیشرفته رویداد
 */
export interface EventSettings {
  maxCapacity?: number;         // ظرفیت کل
  allowWaitlist?: boolean;      // لیست انتظار
  requireApproval?: boolean;    // تأیید دستی ثبت‌نام
  checkInRequired?: boolean;    // نیاز به چک‌این
  allowCancel?: boolean;        // امکان کنسل کردن
  cancelDeadline?: Date | string; // مهلت کنسل
  emailNotifications?: boolean; // نوتیف ایمیل
  smsNotifications?: boolean;   // نوتیف پیامک
  publicRegistration?: boolean; // ثبت‌نام عمومی
  password?: string;            // رمز ورود (اگر private باشد)
  customFields?: CustomField[]; // فیلدهای سفارشی
}




