import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id?: number;
  userId: number;
  message: string;
  isRead: boolean;
  sentAt: string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNotificationRequest {
  userId: number;
  message: string;
  link?: string;
}

export interface Reminder {
  id?: number;
  userId: number;
  eventId?: number;
  taskId?: number;
  reminderTime: string;
  method: 'EMAIL' | 'SMS' | 'IN_APP' | 'ALL';
  isSent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/api/notifications`;

  constructor(private http: HttpClient) {}

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  getNotificationById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  createNotification(notification: CreateNotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  updateNotification(id: number, notification: Partial<Notification>): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}`, notification);
  }

  markNotificationAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/read`, null);
  }

  markAllNotificationsAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/${userId}/read-all`, null);
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getNotificationsByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUnreadNotificationsByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}/unread`);
  }

  getNotificationCountByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/count`);
  }

  // Reminder methods
  getAllReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/reminders`);
  }

  getReminderById(id: number): Observable<Reminder> {
    return this.http.get<Reminder>(`${this.apiUrl}/reminders/${id}`);
  }

  createReminder(reminder: Partial<Reminder>): Observable<Reminder> {
    return this.http.post<Reminder>(`${this.apiUrl}/reminders`, reminder);
  }

  updateReminder(id: number, reminder: Partial<Reminder>): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/reminders/${id}`, reminder);
  }

  markReminderAsSent(id: number): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/reminders/${id}/sent`, null);
  }

  deleteReminder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reminders/${id}`);
  }

  getRemindersByUser(userId: number): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/reminders/user/${userId}`);
  }

  getPendingReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/reminders/pending`);
  }
}
