import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, EventStatus } from '../../models';
import { formatPersianDate, formatPersianTime } from '../../../shared/utils/persian-utils';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input() event: Event | any;
  @Input() showRouterLink = true;

  constructor(
    private router: Router,
    private eventService: EventService
  ) {}

  get displayLocation(): string {
    // Handle both old format (string) and new format (Location object)
    if (!this.event.location) return 'مکان نامشخص';
    if (typeof this.event.location === 'string') return this.event.location;
    if (this.event.location.address) return this.event.location.address;
    return 'مکان نامشخص';
  }

  get displayDate(): string {
    // Handle both old format (string) and new format (ISO date)
    if (this.event.date) return this.event.date;
    if (this.event.startAt) {
      const dateStr = formatPersianDate(this.event.startAt);
      const timeStr = formatPersianTime(this.event.startAt);
      return `${dateStr} ${timeStr}`;
    }
    return 'تاریخ نامشخص';
  }

  get statusText(): string {
    // Handle both old format and new format (EventStatus enum)
    if (!this.event.status) return 'نامشخص';
    if (this.event.status === 'active' || this.event.status === EventStatus.PUBLISHED) return 'فعال';
    if (this.event.status === 'upcoming' || this.event.status === EventStatus.DRAFT) return 'پیش‌رو';
    if (this.event.status === 'ended' || this.event.status === EventStatus.ENDED) return 'پایان‌یافته';
    return 'نامشخص';
  }

  get statusClass(): string {
    // Handle both old format and new format (EventStatus enum)
    if (!this.event.status) return '';
    if (this.event.status === 'active' || this.event.status === EventStatus.PUBLISHED) return 'active';
    if (this.event.status === 'upcoming' || this.event.status === EventStatus.DRAFT) return 'upcoming';
    if (this.event.status === 'ended' || this.event.status === EventStatus.ENDED) return 'ended';
    return '';
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/events/edit', this.event.id]);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (confirm('آیا از حذف این رویداد اطمینان دارید؟')) {
      this.eventService.deleteEvent(this.event.id);
      window.location.reload();
    }
  }
}

