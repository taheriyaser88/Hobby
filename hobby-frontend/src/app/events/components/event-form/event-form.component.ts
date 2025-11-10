import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, EventType, EventStatus } from '../../models';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  event = {
    id: null as any,
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    capacity: '',
    price: '',
    category: '',
    status: 'upcoming',
    persianYear: '',
    persianMonth: '',
    persianDay: ''
  };
  isEditMode = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.params['id'];
    if (eventId) {
      this.isEditMode = true;
      this.loadEvent(parseInt(eventId, 10));
    }
  }

  loadEvent(id: number) {
    const eventData = this.eventService.getEventById(id);
    console.log('Loading event:', eventData, 'with id:', id);
    if (eventData) {
      // Map Event model to form data
      this.event.id = eventData.id as any;
      this.event.title = eventData.title || '';
      this.event.description = eventData.description || '';
      this.event.category = eventData.category || '';
      
      // Parse location
      if (eventData.location && typeof eventData.location === 'object') {
        this.event.location = eventData.location.address || '';
      }
      
      // Parse startAt date to Persian
      if (eventData.startAt) {
        const startDate = new Date(eventData.startAt);
        const persianDate = this.convertToPersian(startDate);
        if (persianDate) {
          this.event.persianYear = persianDate.year;
          this.event.persianMonth = persianDate.month;
          this.event.persianDay = persianDate.day;
        }
      }
      
      // Parse time
      if (eventData.startAt) {
        const startDate = new Date(eventData.startAt);
        const hours = startDate.getHours().toString().padStart(2, '0');
        const minutes = startDate.getMinutes().toString().padStart(2, '0');
        this.event.time = `${hours}:${minutes}`;
      }
      
      // Load other fields
      if (eventData.settings?.maxCapacity) {
        this.event.capacity = eventData.settings.maxCapacity.toString();
      }
    } else {
      console.error('Event not found with id:', id);
    }
  }

  private convertToPersian(date: Date): { year: string, month: string, day: string } | null {
    // Simple conversion - you might want to use a proper Persian date library
    const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    // Approximate conversion
    const year = date.getFullYear() - 621;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return {
      year: year.toString(),
      month: month.toString(),
      day: day.toString()
    };
  }

  private persianToGregorian(year: number, month: number, day: number): Date {
    // Simple conversion - you might want to use a proper Persian date library
    const gregYear = year + 621;
    // Approximate month/day conversion
    return new Date(gregYear, month - 1, day);
  }

  onSubmit() {
    if (!this.event.title || !this.event.location || !this.event.persianYear || !this.event.persianMonth || !this.event.persianDay) {
      alert('لطفاً فیلدهای اجباری را پر کنید!');
      return;
    }

    if (!this.isValidDate()) {
      alert('لطفاً تاریخ معتبر وارد کنید!');
      return;
    }

    if (this.isPastDate()) {
      alert('نمی‌توانید تاریخ گذشته انتخاب کنید!');
      return;
    }

    // Convert Persian date to Gregorian
    const year = parseInt(this.event.persianYear);
    const month = parseInt(this.event.persianMonth);
    const day = parseInt(this.event.persianDay);
    
    const [hours = '10', minutes = '00'] = this.event.time.split(':');
    const startDate = this.persianToGregorian(year, month, day);
    startDate.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 8); // Default 8 hour event

    // Create event data according to Event model
    const eventData: Partial<Event> = {
      id: this.isEditMode ? this.event.id : undefined,
      title: this.event.title,
      slug: this.generateSlug(this.event.title),
      category: this.event.category || 'general',
      description: this.event.description,
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
      timezone: 'Asia/Tehran',
      type: EventType.PHYSICAL,
      location: {
        address: this.event.location
      },
      status: this.event.status === 'upcoming' ? EventStatus.PUBLISHED : EventStatus.DRAFT,
      settings: {
        maxCapacity: this.event.capacity ? parseInt(this.event.capacity) : undefined
      },
      stats: {
        totalAttendees: 0,
        checkedInAttendees: 0,
        totalTicketsSold: 0,
        totalRevenue: 0
      }
    };

    this.eventService.saveEvent(eventData);
    alert(this.isEditMode ? 'رویداد با موفقیت به‌روزرسانی شد!' : 'رویداد با موفقیت ایجاد شد!');
    this.router.navigate(['/events']);
  }

  private generateSlug(title: string): string {
    // Simple slug generation - you might want to use a proper Persian slug library
    return title.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '')
      + '-' + Date.now().toString().slice(-6);
  }

  private isValidDate(): boolean {
    const year = parseInt(this.event.persianYear);
    const month = parseInt(this.event.persianMonth);
    const day = parseInt(this.event.persianDay);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
    if (year < 1400 || year > 1410) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
  }

  private isPastDate(): boolean {
    const year = parseInt(this.event.persianYear);
    const month = parseInt(this.event.persianMonth);
    const day = parseInt(this.event.persianDay);

    // Get today's Persian date (approximate)
    const now = new Date();
    const todayYear = now.getFullYear() - 621;
    const todayMonth = now.getMonth() + 7; // Approximate
    const todayDay = now.getDate();

    // Simple comparison
    if (year < todayYear) return true;
    if (year === todayYear && month < todayMonth) return true;
    if (year === todayYear && month === todayMonth && day < todayDay) return true;

    return false;
  }

  cancel() {
    this.router.navigate(['/events']);
  }
}
