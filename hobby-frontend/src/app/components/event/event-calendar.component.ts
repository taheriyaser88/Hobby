import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
// import { NzTextareaModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-calendar',
  standalone: true,
  imports: [
    CommonModule,
    NzCalendarModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzBadgeModule,
    NzTagModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzSelectModule,
    // NzTextareaModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="event-calendar-container">
      <!-- Header -->
      <div class="calendar-header">
        <h2>Event Calendar</h2>
        <div class="header-actions">
          <button nz-button nzType="primary" (click)="showCreateModal()">
            <i nz-icon nzType="plus"></i>
            New Event
          </button>
          <button nz-button nzType="default" (click)="toggleView()">
            <i nz-icon [nzType]="viewMode === 'month' ? 'calendar' : 'appstore'"></i>
            {{ viewMode === 'month' ? 'Month View' : 'List View' }}
          </button>
        </div>
      </div>

      <!-- Calendar View -->
      <div *ngIf="viewMode === 'month'" class="calendar-view">
        <nz-calendar 
          [nzValue]="selectedDate"
          [nzMode]="'month'"
          (nzSelectChange)="onDateSelect($event)"
          (nzPanelChange)="onPanelChange($event)">
          <ng-container *nzDateCell="let date">
            <div class="date-cell">
              <div class="date-number">{{ date.getDate() }}</div>
              <div class="events-list">
                <nz-badge 
                  *ngFor="let event of getEventsForDate(date)"
                  [nzCount]="1"
                  [nzColor]="event.color"
                  [nzTitle]="event.title">
                </nz-badge>
              </div>
            </div>
          </ng-container>
        </nz-calendar>
      </div>

      <!-- List View -->
      <div *ngIf="viewMode === 'list'" class="list-view">
        <nz-card *ngFor="let event of events" class="event-card">
          <div class="event-content">
            <div class="event-time">
              <nz-tag [nzColor]="event.color">{{ event.time }}</nz-tag>
            </div>
            <div class="event-details">
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
              <div class="event-meta">
                <span><i nz-icon nzType="environment"></i> {{ event.location }}</span>
                <span><i nz-icon nzType="user"></i> {{ event.attendees }} attendees</span>
              </div>
            </div>
            <div class="event-actions">
              <button nz-button nzType="text" nzSize="small">
                <i nz-icon nzType="edit"></i>
              </button>
              <button nz-button nzType="text" nzSize="small" nzDanger>
                <i nz-icon nzType="delete"></i>
              </button>
            </div>
          </div>
        </nz-card>
      </div>

      <!-- Create Event Modal -->
      <nz-modal
        [(nzVisible)]="isCreateModalVisible"
        nzTitle="Create New Event"
        nzOkText="Create"
        nzCancelText="Cancel"
        (nzOnOk)="createEvent()"
        (nzOnCancel)="cancelCreate()">
        <form nz-form [formGroup]="eventForm">
          <nz-form-item>
            <nz-form-label>Event Title</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="title" placeholder="Enter event title" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>Description</nz-form-label>
            <nz-form-control>
              <textarea nz-input formControlName="description" placeholder="Enter event description"></textarea>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>Date & Time</nz-form-label>
            <nz-form-control>
              <nz-date-picker formControlName="date" nzShowTime></nz-date-picker>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>Location</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="location" placeholder="Enter location" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>Category</nz-form-label>
            <nz-form-control>
              <nz-select formControlName="category" placeholder="Select category">
                <nz-option nzValue="work" nzLabel="Work"></nz-option>
                <nz-option nzValue="personal" nzLabel="Personal"></nz-option>
                <nz-option nzValue="meeting" nzLabel="Meeting"></nz-option>
                <nz-option nzValue="social" nzLabel="Social"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </form>
      </nz-modal>
    </div>
  `,
  styles: [`
    .event-calendar-container {
      padding: 24px;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .calendar-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .calendar-view {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 16px;
    }

    .list-view {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .event-card {
      margin-bottom: 16px;
    }

    .event-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .event-time {
      min-width: 80px;
    }

    .event-details {
      flex: 1;
    }

    .event-details h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .event-details p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
    }

    .event-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #999;
    }

    .event-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .event-actions {
      display: flex;
      gap: 8px;
    }

    .date-cell {
      position: relative;
      height: 100%;
    }

    .date-number {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .events-list {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .event-calendar-container {
        padding: 16px;
      }

      .calendar-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }

      .event-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .event-actions {
        align-self: flex-end;
      }
    }
  `]
})
export class EventCalendarComponent implements OnInit {
  viewMode: 'month' | 'list' = 'month';
  selectedDate = new Date();
  isCreateModalVisible = false;
  eventForm: any;

  events = [
    {
      id: 1,
      title: 'Team Meeting',
      description: 'Weekly team sync',
      date: new Date(),
      time: '10:00 AM',
      location: 'Conference Room A',
      attendees: 8,
      color: 'blue',
      category: 'work'
    },
    {
      id: 2,
      title: 'Project Review',
      description: 'Review project progress',
      date: new Date(),
      time: '2:00 PM',
      location: 'Office',
      attendees: 5,
      color: 'green',
      category: 'work'
    },
    {
      id: 3,
      title: 'Gym Session',
      description: 'Personal workout',
      date: new Date(),
      time: '6:00 PM',
      location: 'Fitness Center',
      attendees: 1,
      color: 'orange',
      category: 'personal'
    }
  ];

  ngOnInit(): void {
    // Initialize form
    this.eventForm = {
      title: '',
      description: '',
      date: null,
      location: '',
      category: ''
    };
  }

  toggleView(): void {
    this.viewMode = this.viewMode === 'month' ? 'list' : 'month';
  }

  onDateSelect(date: Date): void {
    this.selectedDate = date;
    console.log('Selected date:', date);
  }

  onPanelChange(event: any): void {
    console.log('Panel changed:', event);
  }

  getEventsForDate(date: Date): any[] {
    return this.events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  }

  showCreateModal(): void {
    this.isCreateModalVisible = true;
  }

  createEvent(): void {
    console.log('Creating event:', this.eventForm);
    // Add event creation logic here
    this.isCreateModalVisible = false;
  }

  cancelCreate(): void {
    this.isCreateModalVisible = false;
  }
}
