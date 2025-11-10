import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { UserService } from '../../../../users/services/user.service';
import { User, UserStatus, UserRole } from '../../../../users/models';
import { EventTask } from '../../../models/interfaces/task.interface';
import { TaskStatus, TaskPriority } from '../../../models/enums';
import { gregorianToPersian, persianToGregorian } from '../../../../shared/utils/persian-utils';

@Component({
  selector: 'app-event-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-tasks.component.html',
  styleUrls: ['../event-detail.component.css', './event-tasks.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventTasksComponent implements OnInit {

  eventId: number | null = null;
  filteredTasks: any[] = [];
  draggedTask: any = null;
  draggedTaskStatus: string = '';
  showModal: boolean = false;
  newTask: Partial<EventTask> = {
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    dueDate: ''
  };
  dueDatePersian = {
    year: '',
    month: '',
    day: ''
  };
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.eventId = parseInt(this.route.snapshot.parent?.params['id'] || '0', 10);
    this.loadTasks();
  }

  loadTasks() {
    if (this.eventId) {
      this.filteredTasks = this.taskService.getTasks(this.eventId);
    } else {
      this.filteredTasks = [];
    }
  }

  getTasksByStatus(status: string) {
    return this.filteredTasks.filter(t => t.status === status);
  }


  getPriorityText(priority: string): string {
    const priorityMap: any = {
      'low': 'Low',
      'mid': 'Medium',
      'medium': 'Medium',
      'high': 'High',
      'LOW': 'Low',
      'MEDIUM': 'Medium',
      'HIGH': 'High'
    };
    return priorityMap[priority?.toLowerCase()] || priority || 'Medium';
  }

  getPriorityClass(priority: string): string {
    const priorityLower = priority?.toLowerCase() || '';
    if (priorityLower === 'high' || priorityLower === 'HIGH') {
      return 'high';
    } else if (priorityLower === 'medium' || priorityLower === 'mid' || priorityLower === 'MEDIUM') {
      return 'mid';
    } else {
      return 'low';
    }
  }

  onEditTask(taskId: number) {
    this.router.navigate(['/events', this.eventId, 'tasks', 'edit', taskId]);
  }

  onDeleteTask(taskId: number) {
    if (confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
      if (this.eventId) {
        this.taskService.deleteTask(this.eventId, taskId);
        this.loadTasks();
      }
    }
  }

  onCreateTask() {
    this.newTask = {
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      status: 'todo',
      dueDate: ''
    };
    this.dueDatePersian = {
      year: '',
      month: '',
      day: ''
    };
    this.showModal = true;
    // جلوگیری از scroll صفحه
    document.body.style.overflow = 'hidden';
  }

  closeModal(event?: Event) {
    // اگر event وجود دارد و target همان overlay نیست، بستن را انجام نده
    if (event && event.target !== event.currentTarget) {
      return;
    }
    this.showModal = false;
    this.newTask = {
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      status: 'todo',
      dueDate: ''
    };
    this.dueDatePersian = {
      year: '',
      month: '',
      day: ''
    };
    // بازگرداندن scroll صفحه
    document.body.style.overflow = '';
  }

  validatePersianDate(): { valid: boolean; message?: string } {
    // تبدیل به string و trim کردن
    const yearStr = this.dueDatePersian.year ? String(this.dueDatePersian.year).trim() : '';
    const monthStr = this.dueDatePersian.month ? String(this.dueDatePersian.month).trim() : '';
    const dayStr = this.dueDatePersian.day ? String(this.dueDatePersian.day).trim() : '';

    // اگر هیچ فیلدی پر نشده، تاریخ اختیاری است
    if (!yearStr && !monthStr && !dayStr) {
      return { valid: true };
    }

    // اگر یکی از فیلدها پر شده، همه باید پر شوند
    if (!yearStr || !monthStr || !dayStr) {
      return { valid: false, message: 'لطفاً همه فیلدهای تاریخ را پر کنید یا همه را خالی بگذارید.' };
    }

    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);

    // بررسی اینکه اعداد معتبر باشند
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return { valid: false, message: 'لطفاً اعداد معتبر برای تاریخ وارد کنید.' };
    }

    // بررسی محدوده سال
    if (year < 1400 || year > 1410) {
      return { valid: false, message: 'سال باید بین ۱۴۰۰ تا ۱۴۱۰ باشد.' };
    }

    // بررسی محدوده ماه
    if (month < 1 || month > 12) {
      return { valid: false, message: 'ماه باید بین ۱ تا ۱۲ باشد.' };
    }

    // بررسی محدوده روز بر اساس ماه
    const maxDaysInMonth = this.getMaxDaysInPersianMonth(year, month);
    if (day < 1 || day > maxDaysInMonth) {
      return { valid: false, message: `روز باید بین ۱ تا ${maxDaysInMonth} برای این ماه باشد.` };
    }

    return { valid: true };
  }

  getMaxDaysInPersianMonth(year: number, month: number): number {
    // در تقویم شمسی، 6 ماه اول 31 روز و 5 ماه بعدی 30 روز دارند
    // ماه 12 (اسفند) 29 روز است (یا 30 روز در سال کبیسه)
    if (month >= 1 && month <= 6) {
      return 31;
    } else if (month >= 7 && month <= 11) {
      return 30;
    } else if (month === 12) {
      // بررسی سال کبیسه شمسی (تقریبی)
      // سال شمسی کبیسه است اگر باقیمانده تقسیم بر 33 یکی از اعداد 1, 5, 9, 13, 17, 22, 26, 30 باشد
      const remainder = year % 33;
      const leapYears = [1, 5, 9, 13, 17, 22, 26, 30];
      return leapYears.includes(remainder) ? 30 : 29;
    }
    return 31;
  }

  saveTask() {
    if (!this.newTask.title || !this.newTask.title.trim()) {
      alert('لطفاً عنوان وظیفه را وارد کنید.');
      return;
    }

    if (!this.eventId) {
      alert('خطا: شناسه رویداد نامعتبر است.');
      return;
    }

    // اعتبارسنجی تاریخ شمسی
    const dateValidation = this.validatePersianDate();
    if (!dateValidation.valid) {
      alert(dateValidation.message);
      return;
    }

    // تبدیل تاریخ شمسی به میلادی
    let dueDate: string | undefined = undefined;
    if (this.dueDatePersian.year && this.dueDatePersian.month && this.dueDatePersian.day) {
      const year = typeof this.dueDatePersian.year === 'number' ? this.dueDatePersian.year : parseInt(String(this.dueDatePersian.year));
      const month = typeof this.dueDatePersian.month === 'number' ? this.dueDatePersian.month : parseInt(String(this.dueDatePersian.month));
      const day = typeof this.dueDatePersian.day === 'number' ? this.dueDatePersian.day : parseInt(String(this.dueDatePersian.day));
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const gregorianDate = persianToGregorian(year, month, day);
        if (gregorianDate) {
          dueDate = gregorianDate.toISOString();
        } else {
          alert('تاریخ وارد شده نامعتبر است. لطفاً تاریخ صحیح وارد کنید.');
          return;
        }
      }
    }

    const taskToSave: Partial<EventTask> = {
      title: this.newTask.title.trim(),
      description: this.newTask.description?.trim() || '',
      assigneeId: this.newTask.assigneeId || undefined,
      assignee: this.newTask.assigneeId ? this.getUserName({ assigneeId: this.newTask.assigneeId }) : (this.newTask.assignee?.trim() || ''),
      priority: this.newTask.priority || 'medium',
      status: this.newTask.status || 'todo',
      dueDate: dueDate,
      eventId: this.eventId
    };

    this.taskService.saveTask(taskToSave);
    this.loadTasks();
    this.closeModal();
  }

  onDragStart(event: DragEvent, task: any, status: string) {
    this.draggedTask = task;
    this.draggedTaskStatus = status;
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.opacity = '0.5';
    }
  }

  onDragEnd(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.opacity = '1';
    }
    this.draggedTask = null;
    this.draggedTaskStatus = '';
  }

  onDragOver(event: DragEvent, status: string) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.background = '#f0f7ff';
    }
  }

  onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.background = '';
    }
  }

  onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.background = '';
    }
    
    if (this.draggedTask) {
      // تغییر status
      this.draggedTask.status = newStatus;
      this.taskService.saveTask(this.draggedTask);
      this.loadTasks();
    }
  }

  viewTask(task: any) {
    if (task && task.id) {
      this.router.navigate(['/tasks', task.id]);
    }
  }

  getUserById(userId: string | number): User | undefined {
    if (!userId) return undefined;
    return this.userService.getUserById(userId);
  }

  getUserName(task: any): string {
    if (task.assigneeId) {
      const user = this.getUserById(task.assigneeId);
      if (user) return user.fullName;
    }
    return task.assignee || 'تعیین نشده';
  }

  getUserLink(task: any): string | null {
    if (task.assigneeId) {
      return `/users/${task.assigneeId}`;
    }
    return null;
  }

  getAvailableUsers(): User[] {
    return this.userService.getUsers().filter(u => 
      u.status === UserStatus.ACTIVE && u.role !== UserRole.ADMIN
    );
  }
}
