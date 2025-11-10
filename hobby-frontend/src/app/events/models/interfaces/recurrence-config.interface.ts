/**
 * تنظیمات تکرار رویداد
 */
export interface RecurrenceConfig {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;             // هر چند روز/هفته/ماه
  endDate?: Date | string;      // تاریخ پایان تکرار
  endCount?: number;            // تعداد تکرارها
  daysOfWeek?: string[];        // ['MON', 'WED', 'FRI']
  byMonthDay?: number[];        // [1, 15, 30]
}




