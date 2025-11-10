import { TaskPriority, TaskStatus } from '../enums';

/**
 * نوع اولویت (سازگار با UI)
 */
export type TaskPriorityType = 'low' | 'medium' | 'high' | 'LOW' | 'MEDIUM' | 'HIGH' | TaskPriority;

/**
 * نوع وضعیت (سازگار با UI)
 */
export type TaskStatusType = 'todo' | 'inprogress' | 'done' | 'PENDING' | 'IN_PROGRESS' | 'DONE' | TaskStatus;

/**
 * وظیفه رویداد (سازگار با UI)
 */
export interface EventTask {
  id: string | number;
  eventId: string | number;
  title: string;
  description?: string;
  assignee?: string;                 // نام مسئول (برای UI)
  assigneeId?: string | number;      // کاربر مسئول
  createdBy?: string | number;        // سازنده
  priority: TaskPriorityType;         // low, medium, high یا LOW, MEDIUM, HIGH
  status: TaskStatusType;             // todo, inprogress, done یا PENDING, IN_PROGRESS, DONE
  dueDate?: Date | string;            // تاریخ سررسید
  dueTime?: Date | string;            // زمان سررسید
  progress?: number;                  // 0-100
  dependencies?: string[];           // ID وظایف وابسته
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * وظیفه رویداد (با enum - برای API)
 */
export interface Task {
  id: string | number;
  eventId: string | number;
  title: string;
  description?: string;
  assigneeId?: string | number;     // کاربر مسئول
  createdBy: string | number;        // سازنده
  priority: TaskPriority;            // LOW, MEDIUM, HIGH
  status: TaskStatus;                // PENDING, IN_PROGRESS, DONE
  dueDate?: Date | string;           // تاریخ سررسید
  progress?: number;                 // 0-100
  dependencies?: string[];           // ID وظایف وابسته
  createdAt?: Date | string;
  updatedAt?: Date | string;
}



