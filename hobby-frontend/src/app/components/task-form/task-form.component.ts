import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { EventService } from '../../events/services/event.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: {
    id: number | string | null;
    title: string;
    description: string;
    assignee: string;
    status: string;
    priority: string;
    eventId: number | string | null;
  } = {
    id: null,
    title: '',
    description: '',
    assignee: '',
    status: 'todo',
    priority: 'medium',
    eventId: null
  };
  isEditMode = false;
  events: any[] = [];
  users: string[] = ['سارا جعفری', 'علی محمدی', 'الهام رضایی', 'تیم فنی', 'هماهنگ‌کننده'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.events = this.eventService.getEvents();
    
    const taskId = this.route.snapshot.params['id'];
    if (taskId) {
      this.isEditMode = true;
      this.loadTask(parseInt(taskId, 10));
    } else {
      const eventId = this.route.snapshot.queryParams['eventId'];
      if (eventId) {
        this.task.eventId = parseInt(eventId, 10) as any;
      }
    }
  }

  loadTask(id: number) {
    // ابتدا باید eventId را پیدا کنیم
    const allEvents = this.eventService.getEvents();
    let loadedTask: any = null;
    
    for (const event of allEvents) {
      if (event.tasks) {
        const task = event.tasks.find((t: any) => t.id === id);
        if (task) {
          loadedTask = task;
          this.task.eventId = event.id;
          break;
        }
      }
    }
    
    if (loadedTask) {
      this.task = { ...loadedTask };
    }
  }

  onSubmit() {
    if (!this.task.title || !this.task.assignee) {
      alert('لطفاً فیلدهای اجباری را پر کنید!');
      return;
    }

    if (!this.task.eventId) {
      alert('لطفاً رویداد را انتخاب کنید!');
      return;
    }

    this.taskService.saveTask(this.task);
    alert(this.isEditMode ? 'وظیفه با موفقیت به‌روزرسانی شد!' : 'وظیفه با موفقیت ایجاد شد!');
    this.router.navigate(['/tasks']);
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}

