import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/interfaces/event.interface';
import { formatPersianNumber } from '../../../../shared/utils/persian-utils';

@Component({
  selector: 'app-event-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-tickets.component.html',
  styleUrls: ['../event-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventTicketsComponent implements OnInit {
  event: Event | undefined;
  tickets: any[] = [];

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
      this.tickets = this.event?.tickets || [];
    }
  }

  getPersianNumber(num: number | string | null | undefined): string {
    if (num === null || num === undefined) return '۰';
    return formatPersianNumber(num);
  }

  editTicket(name: string) {
    alert('ویرایش مشخصات بلیت: ' + name);
  }

  viewSales(name: string) {
    alert('نمایش آمار فروش بلیت: ' + name);
  }
}
