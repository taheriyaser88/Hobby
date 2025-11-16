import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserRole } from '../enums/user-role.enum';
import { AuthResponse } from './models/auth-response.model';
import { User } from './models/user.model';
import { TokenService } from './token.service';

/**
 * Authentication Service
 * Handles authentication flow, user state management, and Google OAuth integration
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenService = inject(TokenService);
  private readonly http = inject(HttpClient);

  // Current user state as BehaviorSubject for reactive updates
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor() {
    // On initialization, check if user data exists in memory/sessionStorage
    this.initializeUserFromToken();
  }

  /**
   * Redirect to backend Google OAuth authorization endpoint
   * @param returnUrl - Optional URL to redirect back to after successful login
   */
  loginWithGoogle(returnUrl?: string): void {
    const target = new URL(environment.googleAuthUrl);

    if (returnUrl) {
      target.searchParams.set('state', returnUrl);
    } else {
      const currentPath =
        window.location.pathname + window.location.search;
      target.searchParams.set('state', currentPath || '/dashboard');
    }

    // Redirect to backend OAuth endpoint
    window.location.href = target.toString();
  }

  /**
   * Handle authentication callback response from backend
   * Stores token via TokenService and creates/updates user automatically
   * @param response - AuthResponse containing accessToken and user data
   */
  handleAuthCallback(response: AuthResponse): void {
    // Store access token via TokenService
    this.tokenService.setAccessToken(response.accessToken);

    // Try to find existing user by email, or create new user
    this.findOrCreateUser(response.user).subscribe((user) => {
      if (user) {
        this.setCurrentUser(user);
      }
    });
  }

  /**
   * Find user by email, or create new user if not found
   * @param googleUser - User data from Google OAuth response
   * @returns Observable<User>
   */
  private findOrCreateUser(googleUser: User): Observable<User> {
    const apiUrl = `${environment.apiBaseUrl}/users`;

    // First, try to get user by email
    return this.http
      .get<User>(`${apiUrl}/by-email`, {
        params: { email: googleUser.email },
      })
      .pipe(
        // User found - return it
        tap((user) => {
          console.log('User found:', user);
        }),
        catchError((error) => {
          // User not found - create new user
          if (error.status === 404) {
            console.log('User not found, creating new user...');
            const newUser: Omit<User, 'id' | 'createdAt'> = {
              name: googleUser.name,
              email: googleUser.email,
              picture: googleUser.picture,
              role: UserRole.USER, // Default role
              roles: ['کاربر'], // For backward compatibility
            };

            return this.http.post<User>(apiUrl, newUser).pipe(
              tap((createdUser) => {
                console.log('User created:', createdUser);
              })
            );
          }

          // Other error - return error or fallback
          console.error('Error finding/creating user:', error);
          // Return the Google user as fallback
          return of(googleUser);
        })
      );
  }

  /**
   * Get current user as Observable
   * @returns Observable<User | null>
   */
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  /**
   * Get current user synchronously (current value)
   * @returns User | null
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   * @returns true if user has valid token and user data
   */
  isAuthenticated(): boolean {
    return (
      this.tokenService.hasAccessToken() &&
      this.currentUserSubject.value !== null
    );
  }

  /**
   * Logout: clear tokens and user data
   * Redirects to home page
   */
  logout(): void {
    // Clear access token
    this.tokenService.removeAccessToken();

    // Clear user data
    this.setCurrentUser(null);

    // Redirect to home/login page
    window.location.href = '/';
  }

  /**
   * Set current user and emit to subscribers
   * @param user - User object or null to clear
   */
  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Initialize user from token if available
   * Attempts to decode user info from token (if JWT)
   * or fetches from backend API
   */
  private initializeUserFromToken(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      console.log('initializeUserFromToken: No token found');
      return;
    }

    // Try to decode JWT token to get user info
    try {
      const payload = this.decodeJwtPayload(token);
      if (payload) {
        console.log('initializeUserFromToken: Decoded payload:', payload);
        // Map role from token (could be string like 'SUPER_ADMIN' or 'USER')
        let role: UserRole = UserRole.USER; // Default
        if (payload.role) {
          const roleStr = String(payload.role);
          role = (roleStr === 'SUPER_ADMIN' ? UserRole.SUPER_ADMIN :
                 roleStr === 'EVENT_MANAGER' ? UserRole.EVENT_MANAGER :
                 roleStr === 'STAFF' ? UserRole.STAFF : UserRole.USER) || UserRole.USER;
        } else if (payload.roles && Array.isArray(payload.roles) && payload.roles.length > 0) {
          // Fallback: check roles array
          const roleStr = String(payload.roles[0]);
          if (roleStr === 'admin' || roleStr === 'ادمین' || roleStr === 'SUPER_ADMIN') {
            role = UserRole.SUPER_ADMIN;
          } else if (roleStr === 'EVENT_MANAGER') {
            role = UserRole.EVENT_MANAGER;
          }
        }

        const user: User = {
          id: payload.userId || payload.id || '',
          email: payload.email || '',
          name: payload.name || payload.fullName || '',
          picture: payload.picture || payload.avatarUrl,
          role: role,
          roles: payload.roles || [], // For backward compatibility
        };

        console.log('initializeUserFromToken: Created user from token:', user);

        // Only set user if we have minimum required data
        if (user.id && user.email) {
          this.setCurrentUser(user);
          console.log('initializeUserFromToken: User set successfully');
        } else {
          console.warn('initializeUserFromToken: Missing required fields (id or email)');
          // Try to fetch from backend as fallback
          this.fetchUserFromBackend();
        }
      } else {
        console.warn('initializeUserFromToken: Could not decode payload, fetching from backend');
        // Try to fetch from backend as fallback
        this.fetchUserFromBackend();
      }
    } catch (error) {
      console.warn('initializeUserFromToken: Failed to decode token payload:', error);
      // Token might not be JWT or invalid format - try fetching from backend
      this.fetchUserFromBackend();
    }
  }

  /**
   * Fetch current user from backend API
   */
  private fetchUserFromBackend(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/users/me`).pipe(
      catchError((error) => {
        console.warn('fetchUserFromBackend: Failed to fetch user:', error);
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        // Map backend response to User model
        let role: UserRole = UserRole.USER;
        if (response.role) {
          const roleStr = String(response.role);
          role = (roleStr === 'SUPER_ADMIN' ? UserRole.SUPER_ADMIN :
                 roleStr === 'EVENT_MANAGER' ? UserRole.EVENT_MANAGER :
                 roleStr === 'STAFF' ? UserRole.STAFF : UserRole.USER);
        }

        const user: User = {
          id: response.id || '',
          email: response.email || '',
          name: response.fullName || response.name || '',
          picture: response.avatarUrl || response.avatar || response.picture,
          role: role,
          roles: response.roles || [],
        };

        if (user.id && user.email) {
          console.log('fetchUserFromBackend: User fetched and set:', user);
          this.setCurrentUser(user);
        }
      }
    });
  }

  /**
   * Decode JWT token payload (without verification)
   * @param token - JWT token string
   * @returns Decoded payload object or null
   */
  private decodeJwtPayload(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        return null;
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT payload:', error);
      return null;
    }
  }
}

