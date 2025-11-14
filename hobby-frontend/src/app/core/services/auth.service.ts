import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: number | string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  /**
   * Redirects user to the backend OAuth2 authorization endpoint.
   * @param returnUrl absolute URL that backend should redirect back to after login.
   */
  startGoogleLogin(returnUrl?: string): void {
    const target = new URL(environment.googleAuthUrl);

    if (returnUrl) {
      target.searchParams.set('state', returnUrl);
    } else {
      const currentPath = window.location.pathname + window.location.search;
      target.searchParams.set('state', currentPath || '/');
    }

    window.location.href = target.toString();
  }

  /**
   * Attempts to retrieve the authenticated profile from backend.
   * Backend must set session cookies during OAuth callback.
   */
  fetchProfile() {
    return this.http.get<UserProfile>(`${environment.apiBaseUrl}/auth/me`, {
      withCredentials: true,
    });
  }

  resolveRedirectTarget(stateParam: string | null | undefined): string {
    if (!stateParam) {
      return '/dashboard';
    }
    try {
      const decoded = decodeURIComponent(stateParam);
      if (decoded.startsWith('http')) {
        const url = new URL(decoded);
        const path = url.pathname + url.search;
        // If path is root, redirect to dashboard
        return path === '/' ? '/dashboard' : path;
      }
      const path = decoded.startsWith('/') ? decoded : '/' + decoded;
      // If path is root, redirect to dashboard
      return path === '/' ? '/dashboard' : path;
    } catch {
      return '/dashboard';
    }
  }
}
