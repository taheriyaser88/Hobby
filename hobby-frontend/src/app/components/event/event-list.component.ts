import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService, Event, CreateEventRequest } from '../../services/event.service';
import { TaskService } from '../../services/task.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzMessageModule,
    NzEmptyModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Events</h1>
            <p class="text-gray-600 mt-2">Manage your events and activities</p>
          </div>
          <button nz-button nzType="primary" nzSize="large" (click)="showCreateModal()">
            <span nz-icon nzType="plus"></span> Create Event
          </button>
        </div>

        <!-- Filters -->
        <nz-card class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input 
                nz-input
                type="text" 
                [(ngModel)]="searchTerm"
                (ngModelChange)="applyFilters()"
                placeholder="Search events..."
                class="w-full">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <nz-select [(ngModel)]="selectedCategory" (ngModelChange)="applyFilters()" nzPlaceHolder="All Categories">
                <nz-option nzValue="" nzLabel="All Categories"></nz-option>
                <nz-option nzValue="work" nzLabel="Work"></nz-option>
                <nz-option nzValue="personal" nzLabel="Personal"></nz-option>
                <nz-option nzValue="project" nzLabel="Project"></nz-option>
              </nz-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <nz-select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" nzPlaceHolder="All Status">
                <nz-option nzValue="" nzLabel="All Status"></nz-option>
                <nz-option nzValue="upcoming" nzLabel="Upcoming"></nz-option>
                <nz-option nzValue="ongoing" nzLabel="Ongoing"></nz-option>
                <nz-option nzValue="completed" nzLabel="Completed"></nz-option>
              </nz-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <nz-date-picker [(ngModel)]="selectedDate" (ngModelChange)="applyFilters()" class="w-full"></nz-date-picker>
            </div>
          </div>
        </nz-card>

        <!-- Events Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <nz-card *ngFor="let event of filteredEvents" nzHoverable class="event-card">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-semibold text-gray-900">{{ event.title }}</h3>
              <nz-tag [nzColor]="getEventTypeColor(event.eventType)">{{ event.eventType }}</nz-tag>
            </div>
            
            <p class="text-gray-600 mb-4 line-clamp-2">{{ event.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-500">
                <span nz-icon nzType="calendar" class="mr-2"></span>
                <span>{{ event.startTime | date:'short' }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-500" *ngIf="event.location">
                <span nz-icon nzType="environment" class="mr-2"></span>
                <span>{{ event.location }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <nz-tag [nzColor]="'blue'">{{ event.eventType }}</nz-tag>
                <nz-tag [nzColor]="'green'">{{ event.privacy }}</nz-tag>
              </div>
              <div class="flex space-x-2">
                <button nz-button nzType="link" nzSize="small" (click)="editEvent(event)">
                  <span nz-icon nzType="edit"></span> Edit
                </button>
                <button nz-button nzType="link" nzSize="small" nzDanger (click)="deleteEvent(event.id!)">
                  <span nz-icon nzType="delete"></span> Delete
                </button>
              </div>
            </div>
          </nz-card>
        </div>

        <!-- Empty State -->
        <nz-empty *ngIf="filteredEvents.length === 0" nzText="No events found" nzNotFoundContent="Create your first event to get started">
          <button nz-button nzType="primary" (click)="showCreateModal()">
            <span nz-icon nzType="plus"></span> Create Event
          </button>
        </nz-empty>
      </div>

      <!-- Create/Edit Event Modal -->
      <nz-modal
        [(nzVisible)]="isModalVisible"
        [nzTitle]="isEditMode ? 'Edit Event' : 'Create New Event'"
        (nzOnCancel)="handleModalCancel()"
        (nzOnOk)="handleModalOk()"
        [nzOkLoading]="isLoading"
      >
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="eventForm">
            <nz-form-item>
              <nz-form-label nzRequired>Title</nz-form-label>
              <nz-form-control nzErrorTip="Please input event title!">
                <input nz-input formControlName="title" placeholder="Event Title" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Description</nz-form-label>
              <nz-form-control>
                <textarea nz-input formControlName="description" placeholder="Event Description" nzAutosize></textarea>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Event Type</nz-form-label>
              <nz-form-control nzErrorTip="Please select event type!">
                <nz-select formControlName="eventType" nzPlaceHolder="Select Event Type">
                  <nz-option nzValue="ONLINE" nzLabel="Online"></nz-option>
                  <nz-option nzValue="OFFLINE" nzLabel="Offline"></nz-option>
                  <nz-option nzValue="HYBRID" nzLabel="Hybrid"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Privacy</nz-form-label>
              <nz-form-control nzErrorTip="Please select privacy!">
                <nz-select formControlName="privacy" nzPlaceHolder="Select Privacy">
                  <nz-option nzValue="PUBLIC" nzLabel="Public"></nz-option>
                  <nz-option nzValue="PRIVATE" nzLabel="Private"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Start Time</nz-form-label>
              <nz-form-control nzErrorTip="Please select start time!">
                <nz-date-picker formControlName="startTime" class="w-full"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>End Time</nz-form-label>
              <nz-form-control nzErrorTip="Please select end time!">
                <nz-date-picker formControlName="endTime" class="w-full"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Location</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="location" placeholder="Event Location" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Google Meet Link</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="googleMeetLink" placeholder="Google Meet Link" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Recurring</nz-form-label>
              <nz-form-control>
                <label nz-checkbox formControlName="isRecurring">Is this a recurring event?</label>
              </nz-form-control>
            </nz-form-item>
          </form>
        </ng-container>
      </nz-modal>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .event-card {
      transition: all 0.3s ease;
    }
    .event-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
  `]
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  selectedDate: Date | null = null;
  
  isModalVisible = false;
  isEditMode = false;
  isLoading = false;
  eventForm!: FormGroup;
  currentEventId: number | null = null;

  constructor(
    private eventService: EventService,
    private taskService: TaskService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.eventForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null],
      eventType: ['ONLINE', [Validators.required]],
      privacy: ['PUBLIC', [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      location: [null],
      googleMeetLink: [null],
      isRecurring: [false],
      organizerId: [1] // Mock organizer ID
    });
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events;
        console.log('Events loaded:', events);
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.message.error('Failed to load events');
        // Mock data for development
        this.events = [
          {
            id: 1,
            title: 'Team Meeting',
            description: 'Weekly team sync to discuss project progress and upcoming tasks.',
            eventType: 'ONLINE',
            privacy: 'PUBLIC',
            startTime: '2024-01-15T10:00:00',
            endTime: '2024-01-15T11:00:00',
            location: 'Google Meet',
            googleMeetLink: 'https://meet.google.com/abc-defg-hij',
            isRecurring: true,
            organizerId: 1
          },
          {
            id: 2,
            title: 'Client Presentation',
            description: 'Present the new product features to our key clients.',
            eventType: 'OFFLINE',
            privacy: 'PRIVATE',
            startTime: '2024-01-18T14:00:00',
            endTime: '2024-01-18T15:30:00',
            location: 'Conference Room A',
            isRecurring: false,
            organizerId: 1
          }
        ];
        this.filteredEvents = this.events;
      }
    });
  }

  getEventTypeColor(eventType: string): string {
    switch (eventType) {
      case 'ONLINE':
        return 'blue';
      case 'OFFLINE':
        return 'green';
      case 'HYBRID':
        return 'purple';
      default:
        return 'default';
    }
  }

  applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !this.searchTerm || 
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesCategory = !this.selectedCategory || 
        event.eventType.toLowerCase() === this.selectedCategory.toLowerCase();
      
      const matchesStatus = !this.selectedStatus || 
        this.getEventStatus(event) === this.selectedStatus;
      
      const matchesDate = !this.selectedDate || 
        new Date(event.startTime).toDateString() === this.selectedDate.toDateString();
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  }

  getEventStatus(event: Event): string {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'completed';
  }

  showCreateModal() {
    this.isEditMode = false;
    this.eventForm.reset({
      eventType: 'ONLINE',
      privacy: 'PUBLIC',
      isRecurring: false,
      organizerId: 1
    });
    this.isModalVisible = true;
  }

  editEvent(event: Event) {
    this.isEditMode = true;
    this.currentEventId = event.id!;
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      privacy: event.privacy,
      startTime: new Date(event.startTime),
      endTime: new Date(event.endTime),
      location: event.location,
      googleMeetLink: event.googleMeetLink,
      isRecurring: event.isRecurring
    });
    this.isModalVisible = true;
  }

  handleModalOk() {
    if (this.eventForm.valid) {
      this.isLoading = true;
      const formValue = this.eventForm.value;
      
      // Convert dates to ISO string
      formValue.startTime = formValue.startTime.toISOString();
      formValue.endTime = formValue.endTime.toISOString();
      
      if (this.isEditMode && this.currentEventId) {
        this.eventService.updateEvent(this.currentEventId, formValue).subscribe({
          next: (event) => {
            this.message.success('Event updated successfully');
            this.loadEvents();
            this.isModalVisible = false;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating event:', error);
            this.message.error('Failed to update event');
            this.isLoading = false;
          }
        });
      } else {
        this.eventService.createEvent(formValue).subscribe({
          next: (event) => {
            this.message.success('Event created successfully');
            this.loadEvents();
            this.isModalVisible = false;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error creating event:', error);
            this.message.error('Failed to create event');
            this.isLoading = false;
          }
        });
      }
    } else {
      Object.values(this.eventForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleModalCancel() {
    this.isModalVisible = false;
    this.eventForm.reset();
  }

  deleteEvent(id: number) {
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.message.success('Event deleted successfully');
        this.loadEvents();
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        this.message.error('Failed to delete event');
      }
    });
  }
}