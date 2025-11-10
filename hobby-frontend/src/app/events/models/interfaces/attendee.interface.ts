import { RegistrationStatus, PaymentStatus } from '../enums';

/**
 * شرکت‌کننده رویداد
 */
export interface Attendee {
  id: string | number;
  eventId: string | number;
  userId?: string | number;          // اگر کاربر سیستم باشد
  fullName: string;
  email: string;
  phone?: string;
  ticketId: string | number;         // نوع بلیت
  registrationStatus: RegistrationStatus; // PENDING, CONFIRMED, ...
  paymentStatus: PaymentStatus;      // PENDING, PAID, ...
  checkedIn: boolean;                // چک‌این شده؟
  checkedInAt?: Date | string;
  qrCode?: string;                   // کد QR
  notes?: string;                    // یادداشت‌های اضافی
  customFields?: Record<string, any>; // فیلدهای سفارشی
  registeredAt?: Date | string;
  updatedAt?: Date | string;
}




