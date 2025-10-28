import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Event {
  id?: number;
  title: string;
  description?: string;
  eventType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  privacy: 'PUBLIC' | 'PRIVATE';
  startTime: string;
  endTime: string;
  location?: string;
  googleMeetLink?: string;
  isRecurring: boolean;
  organizerId: number;
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  privacy: 'PUBLIC' | 'PRIVATE';
  startTime: string;
  endTime: string;
  location?: string;
  googleMeetLink?: string;
  isRecurring: boolean;
  organizerId: number;
  categoryId?: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  eventType?: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  privacy?: 'PUBLIC' | 'PRIVATE';
  startTime?: string;
  endTime?: string;
  location?: string;
  googleMeetLink?: string;
  isRecurring?: boolean;
  categoryId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: number, event: UpdateEventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEventsByOrganizer(organizerId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/organizer/${organizerId}`);
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/upcoming`);
  }

  searchEvents(keyword: string): Observable<Event[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Event[]>(`${this.apiUrl}/search`, { params });
  }

  getEventsByCategory(categoryId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  addParticipant(eventId: number, userId: number, status: string = 'INVITED'): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('status', status);
    return this.http.post<any>(`${this.apiUrl}/${eventId}/participants`, null, { params });
  }

  getEventParticipants(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/participants`);
  }

  updateParticipantStatus(eventId: number, userId: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put<any>(`${this.apiUrl}/${eventId}/participants/${userId}`, null, { params });
  }

  removeParticipant(eventId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/participants/${userId}`);
  }
}
