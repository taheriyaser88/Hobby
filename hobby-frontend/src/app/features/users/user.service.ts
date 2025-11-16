import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from './models/user.model';

/**
 * User Service
 * Handles CRUD operations for users
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/users`;

  private mapBackendToUser(dto: any): User {
    return {
      id: String(dto.id),
      name: dto.fullName || dto.name || '',
      email: dto.email,
      picture: dto.avatar || dto.picture || undefined,
      roles: dto.roles || (dto.role ? [dto.role] : []),
      createdAt: dto.createdAt,
    };
  }

  private mapUserToBackend(user: Partial<User>): any {
    // Map Persian roles to enum-like strings; pick first as primary
    const roles: string[] = user.roles || [];
    let primaryRole = 'USER';
    if (roles.includes('ادمین') || roles.includes('admin') || roles.includes('SUPER_ADMIN')) {
      primaryRole = 'SUPER_ADMIN';
    } else if (roles.includes('سازمان‌دهنده') || roles.includes('EVENT_MANAGER')) {
      primaryRole = 'EVENT_MANAGER';
    }

    return {
      fullName: user.name,
      email: user.email,
      avatar: user.picture,
      role: primaryRole,
    };
  }

  /**
   * Get all users
   * @returns Observable<User[]>
   */
  getUsers(): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res: any) => {
        const items = Array.isArray(res) ? res : res.items || [];
        return items.map((u: any) => this.mapBackendToUser(u));
      }),
    );
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @returns Observable<User>
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((dto: any) => this.mapBackendToUser(dto)),
    );
  }

  /**
   * Get user by email
   * @param email - User email
   * @returns Observable<User>
   */
  getUserByEmail(email: string): Observable<User> {
    return this.http
      .get<any>(`${this.apiUrl}/by-email`, {
        params: { email },
      })
      .pipe(
        map((dto: any) => this.mapBackendToUser(dto)),
      );
  }

  /**
   * Create new user
   * @param user - User data (without id)
   * @returns Observable<User>
   */
  createUser(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const payload = this.mapUserToBackend(user);
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map((dto: any) => this.mapBackendToUser(dto)),
    );
  }

  /**
   * Update existing user
   * @param id - User ID
   * @param user - Updated user data
   * @returns Observable<User>
   */
  updateUser(id: string, user: Partial<User>): Observable<User> {
    const payload = this.mapUserToBackend(user);
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map((dto: any) => this.mapBackendToUser(dto)),
    );
  }

  /**
   * Delete user
   * @param id - User ID
   * @returns Observable<void>
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


