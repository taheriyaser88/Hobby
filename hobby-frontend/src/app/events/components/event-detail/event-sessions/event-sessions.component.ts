import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/interfaces/event.interface';
import { Session } from '../../../models/interfaces/session.interface';
import { formatPersianTime, formatPersianDate, formatPersianNumber as formatPersianNum, persianToGregorian } from '../../../../shared/utils/persian-utils';

@Component({
  selector: 'app-event-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-sessions.component.html',
  styleUrls: ['../event-detail.component.css', './event-sessions.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventSessionsComponent implements OnInit {
  event: Event | undefined;
  sessions: any[] = [];
  showModal: boolean = false;
  showViewModal: boolean = false;
  selectedSession: any = null;
  newSession: Partial<Session> = {
    title: '',
    description: '',
    speakerName: '',
    location: '',
    capacity: undefined
  };
  sessionDatePersian = {
    year: '',
    month: '',
    day: ''
  };
  startTimePersian = {
    hour: '',
    minute: ''
  };
  endTimePersian = {
    hour: '',
    minute: ''
  };

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadEvent();
  }

  loadEvent() {
    const parent = this.route.parent;
    const idParam = (parent?.snapshot.paramMap.get('id') ?? this.route.snapshot.paramMap.get('id')) as string | null;
    const parsedId = idParam ? (isNaN(+idParam) ? idParam : +idParam) : undefined;
    if (parsedId !== undefined) {
      this.event = this.eventService.getEventById(parsedId);
      this.sessions = this.eventService.getEventSessions(parsedId);
    }
  }

  getSessionTime(session: any): string {
    if (!session.startTime || !session.endTime) return '—';
    return `${formatPersianTime(session.startTime)} - ${formatPersianTime(session.endTime)}`;
  }

  openNewSession() {
    this.newSession = {
      title: '',
      description: '',
      speakerName: '',
      location: '',
      capacity: undefined
    };
    this.sessionDatePersian = {
      year: '',
      month: '',
      day: ''
    };
    this.startTimePersian = {
      hour: '',
      minute: ''
    };
    this.endTimePersian = {
      hour: '',
      minute: ''
    };
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(clickEvent?: any) {
    if (clickEvent && clickEvent.target !== clickEvent.currentTarget) {
      return;
    }
    this.showModal = false;
    document.body.style.overflow = '';
  }

  validatePersianDate(date: { year: string | number, month: string | number, day: string | number }): { valid: boolean; message?: string } {
    const yearStr = date.year ? String(date.year).trim() : '';
    const monthStr = date.month ? String(date.month).trim() : '';
    const dayStr = date.day ? String(date.day).trim() : '';

    if (!yearStr || !monthStr || !dayStr) {
      return { valid: false, message: 'لطفاً همه فیلدهای تاریخ را پر کنید.' };
    }

    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return { valid: false, message: 'لطفاً اعداد معتبر برای تاریخ وارد کنید.' };
    }

    if (year < 1400 || year > 1410) {
      return { valid: false, message: 'سال باید بین ۱۴۰۰ تا ۱۴۱۰ باشد.' };
    }

    if (month < 1 || month > 12) {
      return { valid: false, message: 'ماه باید بین ۱ تا ۱۲ باشد.' };
    }

    const maxDaysInMonth = this.getMaxDaysInPersianMonth(year, month);
    if (day < 1 || day > maxDaysInMonth) {
      return { valid: false, message: `روز باید بین ۱ تا ${maxDaysInMonth} برای این ماه باشد.` };
    }

    return { valid: true };
  }

  getMaxDaysInPersianMonth(year: number, month: number): number {
    if (month >= 1 && month <= 6) {
      return 31;
    } else if (month >= 7 && month <= 11) {
      return 30;
    } else if (month === 12) {
      const remainder = year % 33;
      const leapYears = [1, 5, 9, 13, 17, 22, 26, 30];
      return leapYears.includes(remainder) ? 30 : 29;
    }
    return 31;
  }

  saveSession() {
    if (!this.newSession.title || !this.newSession.title.trim()) {
      alert('لطفاً عنوان جلسه را وارد کنید.');
      return;
    }

    if (!this.event?.id) {
      alert('خطا: شناسه رویداد نامعتبر است.');
      return;
    }

    // اعتبارسنجی تاریخ
    const dateValidation = this.validatePersianDate(this.sessionDatePersian);
    if (!dateValidation.valid) {
      alert(dateValidation.message);
      return;
    }

    // اعتبارسنجی ساعت شروع
    const startHour = parseInt(String(this.startTimePersian.hour || '0'));
    const startMinute = parseInt(String(this.startTimePersian.minute || '0'));
    if (startHour < 0 || startHour > 23 || startMinute < 0 || startMinute > 59) {
      alert('لطفاً ساعت شروع معتبر وارد کنید.');
      return;
    }

    // اعتبارسنجی ساعت پایان
    const endHour = parseInt(String(this.endTimePersian.hour || '0'));
    const endMinute = parseInt(String(this.endTimePersian.minute || '0'));
    if (endHour < 0 || endHour > 23 || endMinute < 0 || endMinute > 59) {
      alert('لطفاً ساعت پایان معتبر وارد کنید.');
      return;
    }

    // تبدیل تاریخ شمسی به میلادی (یک تاریخ برای هر دو)
    const year = parseInt(String(this.sessionDatePersian.year));
    const month = parseInt(String(this.sessionDatePersian.month));
    const day = parseInt(String(this.sessionDatePersian.day));

    const baseGregorianDate = persianToGregorian(year, month, day);
    if (!baseGregorianDate) {
      alert('تاریخ نامعتبر است.');
      return;
    }

    // ایجاد startTime با همان تاریخ و ساعت شروع
    const startGregorianDate = new Date(baseGregorianDate);
    startGregorianDate.setHours(startHour, startMinute, 0, 0);
    const startTime = startGregorianDate.toISOString();

    // ایجاد endTime با همان تاریخ و ساعت پایان
    const endGregorianDate = new Date(baseGregorianDate);
    endGregorianDate.setHours(endHour, endMinute, 0, 0);
    const endTime = endGregorianDate.toISOString();

    // بررسی اینکه endTime بعد از startTime باشد
    if (endTime <= startTime) {
      alert('ساعت پایان باید بعد از ساعت شروع باشد.');
      return;
    }

    const sessionToSave: Partial<Session> = {
      title: this.newSession.title.trim(),
      description: this.newSession.description?.trim() || '',
      speakerName: this.newSession.speakerName?.trim() || '',
      location: this.newSession.location?.trim() || '',
      capacity: this.newSession.capacity ? parseInt(String(this.newSession.capacity)) : undefined,
      startTime: startTime,
      endTime: endTime,
      eventId: this.event.id
    };

    this.eventService.saveEventSession(this.event.id, sessionToSave);
    this.loadEvent();
    this.closeModal();
  }

  deleteSession(sessionId: number | string) {
    if (confirm('آیا از حذف این جلسه اطمینان دارید؟')) {
      if (this.event?.id) {
        this.eventService.deleteEventSession(this.event.id, sessionId);
        this.loadEvent();
      }
    }
  }

  viewSession(session: any) {
    this.selectedSession = session;
    this.showViewModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeViewModal(clickEvent?: any) {
    if (clickEvent && clickEvent.target !== clickEvent.currentTarget) {
      return;
    }
    this.showViewModal = false;
    this.selectedSession = null;
    document.body.style.overflow = '';
  }

  getSessionDate(session: any): string {
    // از startTime استفاده می‌کنیم چون تاریخ یکسان است
    if (!session?.startTime) return '—';
    return formatPersianDate(session.startTime);
  }

  getSessionStartTime(session: any): string {
    if (!session?.startTime) return '—';
    return formatPersianTime(session.startTime);
  }

  getSessionEndTime(session: any): string {
    if (!session?.endTime) return '—';
    return formatPersianTime(session.endTime);
  }

  getPersianNumber(num: number | string): string {
    return formatPersianNum(num);
  }
}
