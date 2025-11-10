import { Injectable } from '@angular/core';
import { EventService } from '../events/services/event.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private eventService: EventService) {}

  getTasks(eventId?: number | string): any[] {
    if (eventId) {
      return this.eventService.getEventTasks(eventId);
    }
    // اگر eventId نداشته باشیم، تمام وظایف همه رویدادها را برمی‌گردانیم
    const events = this.eventService.getEvents();
    const allTasks: any[] = [];
    events.forEach(event => {
      if (event.tasks && event.tasks.length > 0) {
        allTasks.push(...event.tasks);
      }
    });
    return allTasks;
  }

  saveTask(task: any): void {
    if (!task.eventId) {
      console.error('Task must have an eventId');
      return;
    }
    this.eventService.saveEventTask(task.eventId, task);
  }

  getTaskById(eventId: number | string, taskId: number | string): any {
    const tasks = this.eventService.getEventTasks(eventId);
    return tasks.find((t: any) => t.id === taskId);
  }

  deleteTask(eventId: number | string, taskId: number | string): void {
    this.eventService.deleteEventTask(eventId, taskId);
  }
}




