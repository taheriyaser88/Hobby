import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input() event: any;
  @Input() showRouterLink = true;

  constructor(
    private router: Router,
    private eventService: EventService
  ) {}

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

