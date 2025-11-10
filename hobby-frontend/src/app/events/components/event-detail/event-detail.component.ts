import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/interfaces/event.interface';
import { formatPersianDate, toPersianDigits } from '../../../shared/utils/persian-utils';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  eventId: number | string | null = null;
  event: Event | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const idParam = params['id'];
      this.eventId = isNaN(+idParam) ? idParam : +idParam;
      this.loadEvent();
    });
  }

  loadEvent() {
    if (this.eventId) {
      this.event = this.eventService.getEventById(this.eventId);
    }
  }

  getEventDate(): string {
    if (!this.event?.startAt) return '';
    return formatPersianDate(this.event.startAt);
  }

  getEventLocation(): string {
    if (!this.event) return '';
    if (this.event.location) {
      const parts = [
        this.event.location.venue,
        this.event.location.address,
        this.event.location.city
      ].filter(Boolean);
      return parts.join(' • ') || '';
    }
    if (this.event.virtualUrl) {
      return 'رویداد مجازی';
    }
    return '';
  }

  getEventCode(): string {
    if (!this.event?.id) return '';
    return `EV-${toPersianDigits(this.event.id)}`;
  }

  backToEvents() {
    this.router.navigate(['/events']);
  }

  togglePublish() {
    if (!this.event) return;
    
    const newStatus = this.event.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    this.eventService.saveEvent({
      ...this.event,
      status: newStatus as any
    });
    this.loadEvent();
    alert(`وضعیت رویداد به ${newStatus === 'PUBLISHED' ? 'منتشر شده' : 'پیش‌نویس'} تغییر کرد.`);
  }

  isTabActive(tab: string): boolean {
    const url = this.router.url;
    return url.includes(`/${tab}`);
  }
}
