import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { EventService } from '../../services/event.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzStatisticModule,
    NzIconModule,
    NzButtonModule,
    NzListModule,
    NzBadgeModule,
    NzProgressModule,
    NzCalendarModule,
    NzTagModule,
    NzAvatarModule,
    NzEmptyModule,
    NzGridModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      <!-- Stats Cards -->
      <div nz-row [nzGutter]="16" class="stats-row">
        <div nz-col nzXs="24" nzSm="12" nzMd="6">
          <nz-card>
            <nz-statistic
              nzTitle="Total Events"
              [nzValue]="totalEvents"
              [nzPrefix]="eventIcon"
              [nzValueStyle]="{ color: '#4285F4' }">
            </nz-statistic>
            <ng-template #eventIcon><span nz-icon nzType="calendar"></span></ng-template>
          </nz-card>
        </div>
        <div nz-col nzXs="24" nzSm="12" nzMd="6">
          <nz-card>
            <nz-statistic
              nzTitle="Active Tasks"
              [nzValue]="activeTasks"
              [nzPrefix]="taskIcon"
              [nzValueStyle]="{ color: '#34A853' }">
            </nz-statistic>
            <ng-template #taskIcon><span nz-icon nzType="check-square"></span></ng-template>
          </nz-card>
        </div>
        <div nz-col nzXs="24" nzSm="12" nzMd="6">
          <nz-card>
            <nz-statistic
              nzTitle="Completed Tasks"
              [nzValue]="completedTasks"
              [nzPrefix]="completedIcon"
              [nzValueStyle]="{ color: '#FBBC04' }">
            </nz-statistic>
            <ng-template #completedIcon><span nz-icon nzType="check-circle"></span></ng-template>
          </nz-card>
        </div>
        <div nz-col nzXs="24" nzSm="12" nzMd="6">
          <nz-card>
            <nz-statistic
              nzTitle="Upcoming Events"
              [nzValue]="upcomingEvents"
              [nzPrefix]="upcomingIcon"
              [nzValueStyle]="{ color: '#EA4335' }">
            </nz-statistic>
            <ng-template #upcomingIcon><span nz-icon nzType="clock-circle"></span></ng-template>
          </nz-card>
        </div>
      </div>

      <!-- Main Content -->
      <div nz-row [nzGutter]="16" class="main-content">
        <!-- Left Column -->
        <div nz-col nzXs="24" nzLg="16">
          <!-- Today's Events -->
          <nz-card nzTitle="Today's Events" class="events-card">
            <nz-list
              [nzDataSource]="todayEvents"
              nzItemLayout="horizontal">
              <nz-list-item *nzListItem="let event">
                <nz-list-item-meta
                  [nzTitle]="event.title"
                  [nzDescription]="(event.startTime | date:'short') || ''"
                  nzAvatar="📅">
                </nz-list-item-meta>
                <ul nz-list-item-actions>
                  <nz-list-item-action>
                    <nz-tag [nzColor]="getEventTypeColor(event.eventType)">{{ event.eventType }}</nz-tag>
                  </nz-list-item-action>
                </ul>
              </nz-list-item>
            </nz-list>
            <nz-empty *ngIf="todayEvents.length === 0" nzText="No events for today"></nz-empty>
          </nz-card>

          <!-- Recent Tasks -->
          <nz-card nzTitle="Recent Tasks" class="tasks-card mt-4">
            <nz-list
              [nzDataSource]="recentTasks"
              nzItemLayout="horizontal">
              <nz-list-item *nzListItem="let task">
                <nz-list-item-meta
                  [nzTitle]="task.title"
                  [nzDescription]="(task.dueDate | date:'short') || ''"
                  nzAvatar="✅">
                </nz-list-item-meta>
                <ul nz-list-item-actions>
                  <nz-list-item-action>
                    <nz-tag [nzColor]="getTaskStatusColor(task.status)">{{ task.status }}</nz-tag>
                  </nz-list-item-action>
                </ul>
              </nz-list-item>
            </nz-list>
            <nz-empty *ngIf="recentTasks.length === 0" nzText="No recent tasks"></nz-empty>
          </nz-card>
        </div>

        <!-- Right Column -->
        <div nz-col nzXs="24" nzLg="8">
          <!-- Quick Actions -->
          <nz-card nzTitle="Quick Actions" class="quick-actions-card">
            <div class="flex flex-col gap-3">
              <button nz-button nzBlock nzType="primary" nzSize="large" routerLink="/app/events">
                <span nz-icon nzType="plus"></span> Create New Event
              </button>
              <button nz-button nzBlock nzType="default" nzSize="large" routerLink="/app/tasks">
                <span nz-icon nzType="form"></span> Add New Task
              </button>
              <button nz-button nzBlock nzType="default" nzSize="large">
                <span nz-icon nzType="upload"></span> Upload File
              </button>
            </div>
          </nz-card>

          <!-- Task Progress -->
          <nz-card nzTitle="Task Progress" class="progress-card mt-4">
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span>Completed</span>
                  <span>{{ completedTasks }}/{{ totalTasks }}</span>
                </div>
                <nz-progress [nzPercent]="getTaskProgress()" nzStatus="active"></nz-progress>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span>In Progress</span>
                  <span>{{ activeTasks }}</span>
                </div>
                <nz-progress [nzPercent]="getActiveProgress()" nzStatus="active" nzStrokeColor="#34A853"></nz-progress>
              </div>
            </div>
          </nz-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .events-card .ant-card-body, .tasks-card .ant-card-body, .progress-card .ant-card-body {
      padding: 16px;
    }
    .quick-actions-card .ant-card-body {
      padding: 24px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalEvents = 0;
  activeTasks = 0;
  completedTasks = 0;
  upcomingEvents = 0;
  totalTasks = 0;
  
  todayEvents: any[] = [];
  recentTasks: any[] = [];

  constructor(
    private eventService: EventService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load events
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.totalEvents = events.length;
        this.upcomingEvents = events.filter(event => new Date(event.startTime) > new Date()).length;
        this.todayEvents = events.filter(event => {
          const eventDate = new Date(event.startTime);
          const today = new Date();
          return eventDate.toDateString() === today.toDateString();
        });
        console.log('Events loaded for dashboard:', events);
      },
      error: (error) => {
        console.error('Error loading events:', error);
        // Mock data
        this.totalEvents = 5;
        this.upcomingEvents = 3;
        this.todayEvents = [
          { title: 'Team Sync', startTime: new Date().toISOString(), eventType: 'ONLINE' },
          { title: 'Client Demo', startTime: new Date().toISOString(), eventType: 'OFFLINE' }
        ];
      }
    });

    // Load tasks
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.totalTasks = tasks.length;
        this.activeTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length;
        this.completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
        this.recentTasks = tasks.slice(0, 5);
        console.log('Tasks loaded for dashboard:', tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        // Mock data
        this.totalTasks = 8;
        this.activeTasks = 3;
        this.completedTasks = 2;
        this.recentTasks = [
          { title: 'Prepare Q4 Report', dueDate: new Date().toISOString(), status: 'IN_PROGRESS' },
          { title: 'Review UI Designs', dueDate: new Date().toISOString(), status: 'PENDING' }
        ];
      }
    });
  }

  getEventTypeColor(eventType: string): string {
    switch (eventType) {
      case 'ONLINE': return 'blue';
      case 'OFFLINE': return 'green';
      case 'HYBRID': return 'purple';
      default: return 'default';
    }
  }

  getTaskStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'IN_PROGRESS': return 'blue';
      case 'PENDING': return 'orange';
      case 'CANCELLED': return 'red';
      default: return 'default';
    }
  }

  getTaskProgress(): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  getActiveProgress(): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.activeTasks / this.totalTasks) * 100);
  }
}