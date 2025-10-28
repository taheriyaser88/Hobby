import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService, Task, CreateTaskRequest } from '../../services/task.service';
import { NzMessageService } from 'ng-zorro-antd/message';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzBadgeModule,
    NzProgressModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzAvatarModule,
    NzToolTipModule,
    NzMessageModule,
    NzEmptyModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="task-board-container p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Task Board</h2>
        <button nz-button nzType="primary" (click)="showCreateTaskModal()">
          <span nz-icon nzType="plus"></span> Create New Task
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- To Do Column -->
        <nz-card nzTitle="To Do" class="task-column">
          <div *ngFor="let task of getTasksByStatus('PENDING')" class="task-card mb-3">
            <nz-card [nzBordered]="false" nzHoverable>
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-medium">{{ task.title }}</h4>
                <nz-tag [nzColor]="getPriorityColor(task.priority)">{{ task.priority }}</nz-tag>
              </div>
              <p class="text-gray-600 text-sm mb-2">{{ task.description }}</p>
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Due: {{ task.dueDate | date:'short' }}</span>
                <nz-avatar-group>
                  <nz-avatar nz-tooltip nzTooltipTitle="Assigned to {{ task.assigneeId }}" nzIcon="user"></nz-avatar>
                </nz-avatar-group>
              </div>
              <div class="flex justify-end gap-2 mt-3">
                <button nz-button nzSize="small" (click)="editTask(task)">Edit</button>
                <button nz-button nzSize="small" nzDanger (click)="deleteTask(task.id!)">Delete</button>
              </div>
            </nz-card>
          </div>
          <nz-empty *ngIf="getTasksByStatus('PENDING').length === 0" nzText="No tasks to do"></nz-empty>
        </nz-card>

        <!-- In Progress Column -->
        <nz-card nzTitle="In Progress" class="task-column">
          <div *ngFor="let task of getTasksByStatus('IN_PROGRESS')" class="task-card mb-3">
            <nz-card [nzBordered]="false" nzHoverable>
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-medium">{{ task.title }}</h4>
                <nz-tag [nzColor]="getPriorityColor(task.priority)">{{ task.priority }}</nz-tag>
              </div>
              <p class="text-gray-600 text-sm mb-2">{{ task.description }}</p>
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Due: {{ task.dueDate | date:'short' }}</span>
                <nz-avatar-group>
                  <nz-avatar nz-tooltip nzTooltipTitle="Assigned to {{ task.assigneeId }}" nzIcon="user"></nz-avatar>
                </nz-avatar-group>
              </div>
              <div class="flex justify-end gap-2 mt-3">
                <button nz-button nzSize="small" (click)="editTask(task)">Edit</button>
                <button nz-button nzSize="small" nzDanger (click)="deleteTask(task.id!)">Delete</button>
              </div>
            </nz-card>
          </div>
          <nz-empty *ngIf="getTasksByStatus('IN_PROGRESS').length === 0" nzText="No tasks in progress"></nz-empty>
        </nz-card>

        <!-- Done Column -->
        <nz-card nzTitle="Done" class="task-column">
          <div *ngFor="let task of getTasksByStatus('COMPLETED')" class="task-card mb-3">
            <nz-card [nzBordered]="false" nzHoverable>
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-medium">{{ task.title }}</h4>
                <nz-tag [nzColor]="getPriorityColor(task.priority)">{{ task.priority }}</nz-tag>
              </div>
              <p class="text-gray-600 text-sm mb-2">{{ task.description }}</p>
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Due: {{ task.dueDate | date:'short' }}</span>
                <nz-avatar-group>
                  <nz-avatar nz-tooltip nzTooltipTitle="Assigned to {{ task.assigneeId }}" nzIcon="user"></nz-avatar>
                </nz-avatar-group>
              </div>
              <div class="flex justify-end gap-2 mt-3">
                <button nz-button nzSize="small" (click)="editTask(task)">Edit</button>
                <button nz-button nzSize="small" nzDanger (click)="deleteTask(task.id!)">Delete</button>
              </div>
            </nz-card>
          </div>
          <nz-empty *ngIf="getTasksByStatus('COMPLETED').length === 0" nzText="No completed tasks"></nz-empty>
        </nz-card>
      </div>

      <!-- Create/Edit Task Modal -->
      <nz-modal
        [(nzVisible)]="isTaskModalVisible"
        [nzTitle]="isEditMode ? 'Edit Task' : 'Create New Task'"
        (nzOnCancel)="handleTaskModalCancel()"
        (nzOnOk)="handleTaskModalOk()"
        [nzOkLoading]="isLoading"
      >
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="taskForm">
            <nz-form-item>
              <nz-form-label nzRequired>Title</nz-form-label>
              <nz-form-control nzErrorTip="Please input task title!">
                <input nz-input formControlName="title" placeholder="Task Title" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Description</nz-form-label>
              <nz-form-control>
                <textarea nz-input formControlName="description" placeholder="Task Description" nzAutosize></textarea>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Status</nz-form-label>
              <nz-form-control nzErrorTip="Please select task status!">
                <nz-select formControlName="status" nzPlaceHolder="Select Status">
                  <nz-option nzValue="PENDING" nzLabel="Pending"></nz-option>
                  <nz-option nzValue="IN_PROGRESS" nzLabel="In Progress"></nz-option>
                  <nz-option nzValue="COMPLETED" nzLabel="Completed"></nz-option>
                  <nz-option nzValue="CANCELLED" nzLabel="Cancelled"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Priority</nz-form-label>
              <nz-form-control nzErrorTip="Please select task priority!">
                <nz-select formControlName="priority" nzPlaceHolder="Select Priority">
                  <nz-option nzValue="LOW" nzLabel="Low"></nz-option>
                  <nz-option nzValue="MEDIUM" nzLabel="Medium"></nz-option>
                  <nz-option nzValue="HIGH" nzLabel="High"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Due Date</nz-form-label>
              <nz-form-control nzErrorTip="Please select due date!">
                <nz-date-picker formControlName="dueDate" class="w-full"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Assignee ID</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="assigneeId" placeholder="Assignee ID" type="number" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Event ID</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="eventId" placeholder="Event ID" type="number" />
              </nz-form-control>
            </nz-form-item>
          </form>
        </ng-container>
      </nz-modal>
    </div>
  `,
  styles: [`
    .task-column .ant-card-body {
      padding: 16px;
      min-height: 200px;
    }
    .task-card {
      background: #f0f2f5;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.07);
    }
  `]
})
export class TaskBoardComponent implements OnInit {
  tasks: Task[] = [];
  isTaskModalVisible = false;
  isEditMode = false;
  isLoading = false;
  taskForm!: FormGroup;
  currentTaskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private message: NzMessageService
  ) {
    this.taskForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null],
      status: ['PENDING', [Validators.required]],
      priority: ['MEDIUM', [Validators.required]],
      dueDate: [null, [Validators.required]],
      assigneeId: [null],
      eventId: [1] // Mock event ID
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        console.log('Tasks loaded:', tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.message.error('Failed to load tasks');
        // Mock data for development
        this.tasks = [
          {
            id: 1,
            title: 'Implement User Authentication',
            description: 'Set up Google OAuth2 for user login.',
            eventId: 1,
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            dueDate: '2025-11-01T00:00:00',
            assigneeId: 1
          },
          {
            id: 2,
            title: 'Design Dashboard UI',
            description: 'Create a responsive dashboard layout with Ng-Zorro.',
            eventId: 1,
            priority: 'HIGH',
            status: 'PENDING',
            dueDate: '2025-10-28T00:00:00',
            assigneeId: 1
          },
          {
            id: 3,
            title: 'Backend API for Events',
            description: 'Develop REST endpoints for event management.',
            eventId: 1,
            priority: 'MEDIUM',
            status: 'COMPLETED',
            dueDate: '2025-10-15T00:00:00',
            assigneeId: 1
          },
          {
            id: 4,
            title: 'Database Schema Design',
            description: 'Define tables and relationships for the Hobby app.',
            eventId: 1,
            priority: 'HIGH',
            status: 'COMPLETED',
            dueDate: '2025-10-10T00:00:00',
            assigneeId: 1
          },
        ];
      }
    });
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'blue';
      default: return 'gray';
    }
  }

  showCreateTaskModal(): void {
    this.isEditMode = false;
    this.taskForm.reset({ 
      status: 'PENDING', 
      priority: 'MEDIUM',
      eventId: 1
    });
    this.isTaskModalVisible = true;
  }

  editTask(task: Task): void {
    this.isEditMode = true;
    this.currentTaskId = task.id!;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      assigneeId: task.assigneeId,
      eventId: task.eventId
    });
    this.isTaskModalVisible = true;
  }

  handleTaskModalOk(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      const formValue = this.taskForm.value;
      
      // Convert date to ISO string
      if (formValue.dueDate) {
        formValue.dueDate = formValue.dueDate.toISOString();
      }
      
      if (this.isEditMode && this.currentTaskId !== null) {
        // Update existing task
        this.taskService.updateTask(this.currentTaskId, formValue).subscribe({
          next: (task) => {
            this.message.success('Task updated successfully');
            this.loadTasks();
            this.isTaskModalVisible = false;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.message.error('Failed to update task');
            this.isLoading = false;
          }
        });
      } else {
        // Create new task
        this.taskService.createTask(formValue).subscribe({
          next: (task) => {
            this.message.success('Task created successfully');
            this.loadTasks();
            this.isTaskModalVisible = false;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error creating task:', error);
            this.message.error('Failed to create task');
            this.isLoading = false;
          }
        });
      }
    } else {
      Object.values(this.taskForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleTaskModalCancel(): void {
    this.isTaskModalVisible = false;
    this.taskForm.reset();
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.message.success('Task deleted successfully');
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.message.error('Failed to delete task');
      }
    });
  }
}