import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task: any;
  @Output() delete = new EventEmitter<{ id: number | string, eventId?: number | string }>();

  constructor(private router: Router) {}

  getStatusText(status: string): string {
    const statusMap: any = {
      'todo': 'در انتظار',
      'inprogress': 'در حال انجام',
      'done': 'انجام شده'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return 'status-' + status;
  }

  getPriorityText(priority: string): string {
    const priorityMap: any = {
      'low': 'پایین',
      'mid': 'متوسط',
      'medium': 'متوسط',
      'high': 'بالا'
    };
    return priorityMap[priority] || priority;
  }

  getPriorityClass(priority: string): string {
    return 'priority-' + priority;
  }

  onView() {
    this.router.navigate(['/tasks', this.task.id]);
  }

  onEdit(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/tasks', 'edit', this.task.id]);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit({ 
      id: this.task.id, 
      eventId: this.task.eventId 
    });
  }
}

