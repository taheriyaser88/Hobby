import { EventType, EventStatus } from '../enums';
import { Location } from './location.interface';
import { RecurrenceConfig } from './recurrence-config.interface';
import { TeamMember } from './team-member.interface';
import { EventSettings } from './event-settings.interface';
import { Branding } from './branding.interface';
import { SEO } from './seo.interface';
import { EventStats } from './event-stats.interface';
import { EventTask } from './task.interface';
import { Session } from './session.interface';
import { Ticket } from './ticket.interface';
import { Attendee } from './attendee.interface';

/**
 * رویداد اصلی
 */
export interface Event {
  id: string | number;          // شناسه یکتا
  organizationId?: string | number; // شناسه سازمان برگزارکننده

  // اطلاعات پایه
  title: string;                // عنوان رویداد
  slug?: string;                // آدرس URL-friendly
  category?: string;            // دسته‌بندی
  
  // محتوای رویداد
  description?: string;         // توضیحات کامل
  summary?: string;             // خلاصه کوتاه

  // زمان‌بندی
  startAt: Date | string;       // شروع رویداد
  endAt: Date | string;         // پایان رویداد
  timezone?: string;            // zone (Asia/Tehran)
  recurrence?: RecurrenceConfig; // تکرار

  // مکان
  type: EventType;              // PHYSICAL, VIRTUAL, HYBRID
  location?: Location;          // آدرس دقیق
  virtualUrl?: string;          // لینک مجازی

  // وضعیت
  status: EventStatus;          // DRAFT, PUBLISHED, ...

  // تیم
  team?: TeamMember[];          // اعضای تیم

  // متا داده
  settings?: EventSettings;     // تنظیمات پیشرفته
  branding?: Branding;          // لوگو و رنگ‌ها
  seo?: SEO;                    // meta tags

  // آمار
  stats?: EventStats;           // آمار رویداد

  // timestamps
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;

  // ارتباطات (optional - معمولاً جدا load می‌شوند)
  tasks?: EventTask[];
  sessions?: Session[];
  tickets?: Ticket[];
  attendees?: Attendee[];
}



