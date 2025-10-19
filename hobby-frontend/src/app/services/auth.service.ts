import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          console.log('User authenticated:', user);
        },
        error: (error) => {
          console.error('Auth check failed:', error);
          this.logout();
        }
      });
    }
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User>(`${this.apiUrl}/auth/user`, { headers });
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}

