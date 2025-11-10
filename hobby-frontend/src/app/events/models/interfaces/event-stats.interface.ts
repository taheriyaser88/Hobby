/**
 * آمار رویداد
 */
export interface EventStats {
  totalAttendees: number;       // کل ثبت‌نام‌ها
  checkedInAttendees: number;   // چک‌این شده‌ها
  totalTicketsSold: number;     // بلیت‌های فروخته شده
  totalRevenue: number;         // کل درآمد
  currency?: string;            // واحد پول (IRR)
  views?: number;               // تعداد بازدید
  shares?: number;              // تعداد اشتراک‌گذاری
}




