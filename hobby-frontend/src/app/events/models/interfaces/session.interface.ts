import { Material } from './material.interface';

/**
 * جلسه رویداد
 */
export interface Session {
  id: string | number;
  eventId: string | number;
  title: string;                     // عنوان جلسه
  description?: string;
  speakerId?: string | number;       // سخنران
  speakerName?: string;              // نام سخنران
  startTime: Date | string;          // شروع
  endTime: Date | string;            // پایان
  location?: string;                 // محل (زیرمجموعه رویداد)
  capacity?: number;                 // ظرفیت
  attendees?: string[];              // شرکت‌کنندگان جلسه
  materials?: Material[];            // فایل‌ها و لینک‌ها
  streamingUrl?: string;             // پخش زنده
}




