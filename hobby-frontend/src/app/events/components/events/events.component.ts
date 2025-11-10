import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event, EventStatus } from '../../models';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  searchTerm = '';
  events: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.events = this.eventService.getEvents();
  }

  get filteredEvents() {
    if (!this.searchTerm) return this.events;
    const searchLower = this.searchTerm.toLowerCase();
    return this.events.filter(ev => {
      const title = ev.title?.toLowerCase() || '';
      const location = this.getEventLocation(ev)?.toLowerCase() || '';
      const statusText = this.getStatusText(ev)?.toLowerCase() || '';
      
      return title.includes(searchLower) ||
             location.includes(searchLower) ||
             statusText.includes(searchLower) ||
             searchLower.includes(statusText);
    });
  }

  getEventLocation(event: Event): string {
    if (!event.location) return '';
    if (typeof event.location === 'string') return event.location;
    return event.location.address || '';
  }

  getStatusText(event: Event | any): string {
    if (!event.status) return '';
    const status = event.status as any;
    if (status === 'active' || status === EventStatus.PUBLISHED) return 'فعال';
    if (status === 'upcoming' || status === EventStatus.DRAFT) return 'پیش‌رو';
    if (status === 'ended' || status === EventStatus.ENDED) return 'پایان‌یافته';
    return '';
  }

  get hasResults() {
    return this.filteredEvents.length > 0;
  }
}

