import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { EventService, Event } from '../../core/services/event.service';
import { TaskService, Task } from '../../core/services/task.service';
import { DashboardNavbarComponent } from '../../core/components/dashboard-navbar/dashboard-navbar.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, DashboardNavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly eventService = inject(EventService);
  private readonly taskService = inject(TaskService);

  readonly recentEvents = signal<Event[]>([]);
  readonly recentTasks = signal<Task[]>([]);
  readonly stats = signal({
    totalEvents: 0,
    pendingTasks: 0,
    completedTasks: 0,
    activeEvents: 0,
  });
  readonly loading = signal(true);

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadDashboardData();
  }

  private checkLoginStatus(): void {
    // Check URL directly first (for immediate redirects from landing)
    const urlParams = new URLSearchParams(window.location.search);
    const loginParamFromUrl = urlParams.get('login');
    const tokenFromUrl = urlParams.get('token');

    // Also check route snapshot
    const loginParamFromRoute = this.route.snapshot.queryParamMap.get('login');
    const tokenFromRoute = this.route.snapshot.queryParamMap.get('token');

    const loginParam = loginParamFromUrl || loginParamFromRoute;
    const token = tokenFromUrl || tokenFromRoute;

    // Check if we already have a token in localStorage (from landing redirect)
    const existingToken = localStorage.getItem('auth_token');
    const finalToken = token || existingToken;

    if (loginParam === 'success' || finalToken) {
      if (finalToken && !existingToken) {
        // Save token to localStorage if not already saved
        localStorage.setItem('auth_token', finalToken);
        console.log('JWT token saved to localStorage');
      }

      // Only show toast if we just logged in (have query params)
      if (loginParam === 'success' || token) {
        // Decode token to get user name - show notification immediately
        try {
          const tokenToDecode = finalToken || token;
          if (tokenToDecode) {
            const payload = JSON.parse(atob(tokenToDecode.split('.')[1]));
            const displayName = payload.name || payload.email || 'کاربر';
            // Show success message - تک‌خطی رنگی
            this.notification.success(
              `خوش آمدید، ${displayName}! ورود شما با موفقیت انجام شد.`
            );
          } else {
            this.notification.success('ورود شما با موفقیت انجام شد.');
          }
        } catch (e) {
          this.notification.success('ورود شما با موفقیت انجام شد.');
        }
      }

      // Clean URL by removing query params after a short delay to ensure notification is visible
      if (loginParam || token) {
        // Small delay to ensure notification renders before URL change
        setTimeout(() => {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        }, 100);
      }
    }
  }

  loadDashboardData(): void {
    this.loading.set(true);

    // Load events
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        const sortedEvents = events
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 5);

        this.recentEvents.set(sortedEvents);
        this.stats.update((s) => ({
          ...s,
          totalEvents: events.length,
          activeEvents: events.filter(
            (e) => new Date(e.endTime) > new Date()
          ).length,
        }));
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.checkLoadingComplete();
      },
    });

    // Load tasks
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        const sortedTasks = tasks
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 5);

        this.recentTasks.set(sortedTasks);
        this.stats.update((s) => ({
          ...s,
          pendingTasks: tasks.filter((t) => t.status === 'PENDING').length,
          completedTasks: tasks.filter((t) => t.status === 'DONE').length,
        }));
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.checkLoadingComplete();
      },
    });
  }

  private checkLoadingComplete(): void {
    // Simple loading check - can be improved
    setTimeout(() => {
      this.loading.set(false);
    }, 500);
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: 'pending',
      IN_PROGRESS: 'inprogress',
      DONE: 'done',
    };
    return statusMap[status] || 'pending';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  }

  onCreateEvent(): void {
    // TODO: Navigate to event creation page when module is ready
    alert('صفحه ایجاد رویداد به زودی آماده می‌شود');
  }

  onViewEvent(eventId: number): void {
    // TODO: Navigate to event detail page when module is ready
    alert(`نمایش رویداد ${eventId} - به زودی آماده می‌شود`);
  }

  onViewAllEvents(): void {
    // TODO: Navigate to events list page when module is ready
    alert('صفحه لیست رویدادها به زودی آماده می‌شود');
  }

  onCreateTask(): void {
    // TODO: Navigate to task creation page when module is ready
    alert('صفحه ایجاد وظیفه به زودی آماده می‌شود');
  }

  onViewTask(taskId: number): void {
    // TODO: Navigate to task detail page when module is ready
    alert(`نمایش وظیفه ${taskId} - به زودی آماده می‌شود`);
  }

  onViewAllTasks(): void {
    // TODO: Navigate to tasks list page when module is ready
    alert('صفحه لیست وظایف به زودی آماده می‌شود');
  }
}

