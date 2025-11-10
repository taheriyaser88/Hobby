import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { EventService } from '../../../events/services/event.service';
import { formatPersianDate, formatPersianTime } from '../../../shared/utils/persian-utils';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    const taskId = this.route.snapshot.params['id'];
    this.loadTask(parseInt(taskId, 10));
  }

  loadTask(id: number) {
    // ابتدا باید eventId را پیدا کنیم
    const allEvents = this.eventService.getEvents();
    let foundTask: any = null;
    
    for (const event of allEvents) {
      if (event.tasks) {
        const task = event.tasks.find((t: any) => t.id === id);
        if (task) {
          foundTask = task;
          break;
        }
      }
    }
    
    this.task = foundTask;
    if (!this.task) {
      alert('وظیفه یافت نشد');
      this.router.navigate(['/tasks']);
    }
  }

  getStatusText(status: string): string {
    const statusMap: any = {
      'todo': 'در انتظار',
      'inprogress': 'در حال انجام',
      'done': 'انجام شده'
    };
    return statusMap[status] || status;
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

  onEdit() {
    this.router.navigate(['/tasks', 'edit', this.task.id]);
  }

  onDelete() {
    if (confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
      if (this.task && this.task.eventId) {
        this.taskService.deleteTask(this.task.eventId, this.task.id);
        this.router.navigate(['/tasks']);
      } else {
        alert('خطا: eventId یافت نشد');
      }
    }
  }

  onBack() {
    this.router.navigate(['/tasks']);
  }

  getDueDate(dueDate: string | Date): string {
    if (!dueDate) return '—';
    return formatPersianDate(dueDate);
  }

  getCreatedDate(createdAt: string | Date): string {
    if (!createdAt) return '—';
    return formatPersianDate(createdAt);
  }

  getUpdatedDate(updatedAt: string | Date): string {
    if (!updatedAt) return '—';
    return formatPersianDate(updatedAt);
  }
}

