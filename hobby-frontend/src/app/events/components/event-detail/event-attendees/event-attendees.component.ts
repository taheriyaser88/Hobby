import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/interfaces/event.interface';
import { formatPersianNumber } from '../../../../shared/utils/persian-utils';

@Component({
  selector: 'app-event-attendees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-attendees.component.html',
  styleUrls: ['../event-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventAttendeesComponent implements OnInit {
  event: Event | undefined;
  attendees: any[] = [];
  filteredAttendees: any[] = [];

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
      this.attendees = this.event?.attendees || [];
      this.filteredAttendees = this.attendees;
    }
  }

  getPersianNumber(num: number | string | null | undefined): string {
    if (num === null || num === undefined) return '۰';
    return formatPersianNumber(num);
  }

  exportAttendees() {
    alert('خروجی Excel تولید شد (شبیه‌سازی)');
  }

  searchAttendees(term: string) {
    if (!term) {
      this.filteredAttendees = this.attendees;
      return;
    }
    const lowerTerm = term.toLowerCase();
    this.filteredAttendees = this.attendees.filter(attendee => 
      (attendee.fullName?.toLowerCase().includes(lowerTerm) || 
       attendee.email?.toLowerCase().includes(lowerTerm))
    );
  }

  toggleCheckin(attendee: any) {
    attendee.checkedIn = !attendee.checkedIn;
    attendee.checkedInAt = attendee.checkedIn ? new Date().toISOString() : undefined;
    // در اینجا باید با API ذخیره شود
    if (this.event) {
      this.eventService.saveEvent(this.event);
    }
  }
}
