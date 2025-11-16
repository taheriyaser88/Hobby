import { inject, Injectable } from '@angular/core';

/**
 * Token Service
 * Manages access token storage in memory (primary) and sessionStorage (backup)
 * NEVER stores tokens in localStorage for security reasons
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // Primary storage: in-memory variable (most secure)
  private accessToken: string | null = null;

  // Backup storage key for sessionStorage
  private readonly SESSION_STORAGE_KEY = 'auth_access_token';

  // Future: cookie-based refresh token storage (to be implemented)
  // private readonly REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

  constructor() {
    // On service initialization, try to restore token from sessionStorage backup
    this.loadTokenFromSessionStorage();
  }

  /**
   * Set access token in memory and sessionStorage backup
   * @param token - The access token to store
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    try {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, token);
    } catch (error) {
      console.warn('Failed to store token in sessionStorage:', error);
      // Continue anyway - memory storage is primary
    }
  }

  /**
   * Get access token from memory (primary) or sessionStorage (fallback)
   * @returns The access token or null if not found
   */
  getAccessToken(): string | null {
    // Return from memory if available
    if (this.accessToken) {
      return this.accessToken;
    }

    // Fallback to sessionStorage
    try {
      const token = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      if (token) {
        this.accessToken = token; // Restore to memory
        return token;
      }
    } catch (error) {
      console.warn('Failed to read token from sessionStorage:', error);
    }

    return null;
  }

  /**
   * Remove access token from memory and sessionStorage
   */
  removeAccessToken(): void {
    this.accessToken = null;
    try {
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to remove token from sessionStorage:', error);
    }
  }

  /**
   * Check if access token exists
   * @returns true if token exists, false otherwise
   */
  hasAccessToken(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Load token from sessionStorage backup into memory
   * Called during service initialization
   */
  private loadTokenFromSessionStorage(): void {
    try {
      const token = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      if (token) {
        this.accessToken = token;
      }
    } catch (error) {
      // Silently fail - token may not exist or sessionStorage unavailable
    }
  }
}


