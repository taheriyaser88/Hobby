import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from './token.service';

/**
 * Auth Guard
 * Protects routes requiring authentication
 * Redirects to /login if no access token exists
 */
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Check if access token exists
  const hasToken = tokenService.hasAccessToken();

  if (!hasToken) {
    // No token - redirect to login with return URL
    const returnUrl = state.url;
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
    });
    return false;
  }

  // Token exists - allow route access
  return true;
};






