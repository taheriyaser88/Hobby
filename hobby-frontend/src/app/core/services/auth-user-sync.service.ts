import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { TokenService } from '../auth/token.service';

/**
 * Google User Profile from Google OAuth
 */
export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Auth Sync Response from Backend
 */
export interface AuthSyncResponse {
  user: User;
  token: string;
}

/**
 * Auth User Sync Service
 * Handles synchronization of Google OAuth user with backend
 * Creates new user if not exists, or returns existing user with role
 */
@Injectable({
  providedIn: 'root',
})
export class AuthUserSyncService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly apiUrl = `${environment.apiBaseUrl}/auth/google-sync`;

  /**
   * Sync Google user profile with backend
   * - Sends Google profile to backend
   * - Backend creates user if not exists (with USER role)
   * - Backend returns existing user if found (with saved role)
   * - Returns full user + JWT token
   * - Stores JWT in localStorage
   * 
   * @param googleProfile - Google OAuth user profile
   * @returns Observable<User> - Full user with role
   */
  syncGoogleUser(googleProfile: GoogleUserProfile): Observable<User> {
    return this.http.post<AuthSyncResponse>(this.apiUrl, googleProfile).pipe(
      tap((response) => {
        // Store JWT token in localStorage
        // Note: TokenService uses memory/sessionStorage, but we also store in localStorage
        // for compatibility with existing code
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          // Also store in TokenService
          this.tokenService.setAccessToken(response.token);
        }
      }),
      map((response) => response.user)
    );
  }
}






