import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { EventService } from '../../../events/services/event.service';
import { UserService } from '../../../users/services/user.service';
import { User, UserStatus, UserRole } from '../../../users/models';
import { formatPersianTime, persianToGregorian } from '../../../shared/utils/persian-utils';

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
    assigneeId: number | string | null;
    status: string;
    priority: string;
    eventId: number | string | null;
    dueDate?: Date | string | null;
    dueTime?: Date | string | null;
  } = {
    id: null,
    title: '',
    description: '',
    assignee: '',
    assigneeId: null,
    status: 'todo',
    priority: 'medium',
    eventId: null,
    dueDate: null,
    dueTime: null
  };
  isEditMode = false;
  events: any[] = [];
  users: User[] = [];
  dueTimePersian = {
    hour: '',
    minute: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private eventService: EventService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.events = this.eventService.getEvents();
    this.loadUsers();
    
    const taskId = this.route.snapshot.params['id'];
    if (taskId) {
      this.isEditMode = true;
      this.loadTask(parseInt(taskId, 10));
    } else {
      const eventId = this.route.snapshot.queryParams['eventId'];
      if (eventId) {
        this.task.eventId = parseInt(eventId, 10) as any;
      }
      // Reset time fields for new task
      this.dueTimePersian = { hour: '', minute: '' };
    }
  }

  loadUsers() {
    // فقط کاربران فعال که ADMIN نیستند
    this.users = this.userService.getUsers().filter(u => 
      u.status === UserStatus.ACTIVE && u.role !== UserRole.ADMIN
    );
  }

  getUserName(userId: number | string | null): string {
    if (!userId) return '';
    const user = this.userService.getUserById(userId);
    return user ? user.fullName : '';
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
      this.task = { 
        ...loadedTask,
        assigneeId: loadedTask.assigneeId || null,
        assignee: loadedTask.assignee || (loadedTask.assigneeId ? this.getUserName(loadedTask.assigneeId) : ''),
        dueTime: loadedTask.dueTime || null
      };
      
      // اگر زمان وجود دارد، آن را به فرمت ساعت:دقیقه تبدیل کن
      if (loadedTask.dueTime) {
        const timeDate = new Date(loadedTask.dueTime);
        if (!isNaN(timeDate.getTime())) {
          this.dueTimePersian.hour = String(timeDate.getHours()).padStart(2, '0');
          this.dueTimePersian.minute = String(timeDate.getMinutes()).padStart(2, '0');
        }
      } else {
        this.dueTimePersian = { hour: '', minute: '' };
      }
    }
  }

  onSubmit() {
    if (!this.task.title) {
      alert('لطفاً عنوان وظیفه را وارد کنید!');
      return;
    }

    if (!this.task.eventId) {
      alert('لطفاً رویداد را انتخاب کنید!');
      return;
    }

    // اگر assigneeId انتخاب شده، نام کاربر را از UserService بگیر
    if (this.task.assigneeId) {
      const selectedUser = this.userService.getUserById(this.task.assigneeId);
      if (selectedUser) {
        this.task.assignee = selectedUser.fullName;
      }
    }

    // پردازش زمان سررسید
    if (this.dueTimePersian.hour && this.dueTimePersian.minute) {
      const hour = parseInt(String(this.dueTimePersian.hour).trim(), 10);
      const minute = parseInt(String(this.dueTimePersian.minute).trim(), 10);
      
      if (!isNaN(hour) && !isNaN(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
        // اگر dueDate وجود دارد، از آن استفاده کن، وگرنه از امروز
        let baseDate = new Date();
        if (this.task.dueDate) {
          baseDate = new Date(this.task.dueDate);
        }
        
        baseDate.setHours(hour, minute, 0, 0);
        this.task.dueTime = baseDate.toISOString();
      } else {
        alert('لطفاً زمان معتبری وارد کنید (ساعت: ۰-۲۳، دقیقه: ۰-۵۹)');
        return;
      }
    } else {
      this.task.dueTime = null;
    }

    this.taskService.saveTask(this.task);
    alert(this.isEditMode ? 'وظیفه با موفقیت به‌روزرسانی شد!' : 'وظیفه با موفقیت ایجاد شد!');
    if (this.task.id) {
      this.router.navigate(['/tasks', this.task.id]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}

