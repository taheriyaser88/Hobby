import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  searchTerm: string = '';

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.taskService.getTasks();
    this.filteredTasks = this.tasks;
  }

  onSearch(searchValue: string) {
    this.searchTerm = searchValue;
    if (!searchValue) {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  }

  deleteTask(data: { id: number | string, eventId?: number | string }) {
    if (confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
      const { id, eventId } = data;
      if (eventId) {
        this.taskService.deleteTask(eventId, id);
      } else {
        // اگر eventId نداریم، از task پیدا کنیم
        const task = this.tasks.find(t => t.id === id);
        if (task && task.eventId) {
          this.taskService.deleteTask(task.eventId, id);
        } else {
          console.error('Cannot delete task: eventId not found');
          alert('خطا: شناسه رویداد یافت نشد');
          return;
        }
      }
      this.loadTasks();
    }
  }

  viewTask(task: any) {
    if (task && task.id) {
      this.router.navigate(['/tasks', task.id]);
    }
  }
}

