import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  eventId: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  dueDate?: string;
  assigneeId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  eventId: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  startDate?: string;
  dueDate?: string;
  assigneeId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  dueDate?: string;
  assigneeId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTasksByEvent(eventId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/event/${eventId}`);
  }

  getTasksByAssignee(assigneeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/assignee/${assigneeId}`);
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status/${status}`);
  }

  getTasksByPriority(priority: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/priority/${priority}`);
  }

  getOverdueTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/overdue`);
  }

  getActiveTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/active`);
  }

  searchTasks(keyword: string): Observable<Task[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Task[]>(`${this.apiUrl}/search`, { params });
  }

  assignTask(taskId: number, assigneeId: number): Observable<Task> {
    const params = new HttpParams().set('assigneeId', assigneeId.toString());
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/assign`, null, { params });
  }

  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/status`, null, { params });
  }

  addTaskDependency(taskId: number, dependentTaskId: number, type: string): Observable<any> {
    const params = new HttpParams()
      .set('dependentTaskId', dependentTaskId.toString())
      .set('type', type);
    return this.http.post<any>(`${this.apiUrl}/${taskId}/dependencies`, null, { params });
  }

  getTaskDependencies(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${taskId}/dependencies`);
  }

  removeTaskDependency(taskId: number, dependentTaskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}/dependencies/${dependentTaskId}`);
  }
}
