import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Event } from '../../../models/interfaces/event.interface';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../../users/services/user.service';
import { User } from '../../../../users/models';
import { formatPersianDate, formatPersianTime, formatPersianNumber, toPersianDigits } from '../../../../shared/utils/persian-utils';

@Component({
  selector: 'app-event-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-overview.component.html',
  styleUrls: ['../event-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventOverviewComponent implements OnInit {
  event: Event | undefined;

  constructor(
    private route: ActivatedRoute, 
    private eventService: EventService,
    private userService: UserService
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
    }
    if (!this.event) {
      const all = this.eventService.getEvents();
      this.event = all && all.length ? all[0] : undefined;
    }
  }

  getRoleText(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ORGANIZER': 'سازمان‌دهنده',
      'COORGANIZER': 'هم‌سازمان‌دهنده',
      'STAFF': 'کارمند',
      'VOLUNTEER': 'داوطلب'
    };
    return roleMap[role] || role;
  }

  getPersianDate(dateString: string | Date): string {
    return formatPersianDate(dateString);
  }

  getTime(dateString: string | Date): string {
    return formatPersianTime(dateString);
  }

  getPersianNumber(num: number | string | null | undefined): string {
    if (num === null || num === undefined) return '۰';
    return formatPersianNumber(num);
  }

  addToGoogleCalendar() {
    if (!this.event) return;
    // ساخت لینک Google Calendar
    const startDate = new Date(this.event.startAt).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(this.event.endAt).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const location = this.event.location 
      ? `${this.event.location.venue || ''} ${this.event.location.address || ''}`.trim()
      : this.event.virtualUrl || '';
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(this.event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(this.event.description || '')}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  }

  openTeam() {
    alert('باز کردن صفحه مدیریت تیم');
  }

  getUserById(userId: string | number): User | undefined {
    return this.userService.getUserById(userId);
  }

  getUserName(userId: string | number): string {
    const user = this.getUserById(userId);
    return user ? user.fullName : `کاربر ${userId}`;
  }
}
