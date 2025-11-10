import { Component, OnInit } from '@angular/core';
import { EventService } from '../../events/services/event.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentEvents: any[] = [];
  recentTasks: any[] = [];

  constructor(
    private eventService: EventService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadRecentEvents();
    this.loadRecentTasks();
  }

  loadRecentEvents() {
    const allEvents = this.eventService.getEvents();
    // Get all events (including ended) and sort by date (newest first)
    this.recentEvents = allEvents
      .sort((a, b) => {
        // Sort by createdAt if available, otherwise by id
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (typeof a.id === 'number' ? a.id : 0);
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (typeof b.id === 'number' ? b.id : 0);
        return dateB - dateA; // newest first
      })
      .slice(0, 5); // فقط 5 تا آخرین
  }

  loadRecentTasks() {
    const allTasks = this.taskService.getTasks();
    this.recentTasks = allTasks
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (typeof a.id === 'number' ? a.id : 0);
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (typeof b.id === 'number' ? b.id : 0);
        return dateB - dateA;
      })
      .slice(0, 3); // فقط 3 تا آخرین
  }

  getStatusClass(status: string): string {
    return 'status-' + status;
  }
}
