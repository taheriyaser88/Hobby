import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserRole } from '../enums/user-role.enum';

/**
 * Role Guard
 * Protects routes requiring specific user roles
 * Usage in routes: { path: 'admin', canActivate: [roleGuard], data: { requiredRole: 'ADMIN' } }
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get required role from route data
  const requiredRole =
    route.data?.['requiredRole'] ||
    route.data?.['role'] ||
    (route.firstChild?.data?.['requiredRole'] as string | undefined);

  if (!requiredRole) {
    console.warn(
      'roleGuard: No requiredRole specified in route data. Allowing access.'
    );
    return true;
  }

  // Check if user has the required role
  return authService.getCurrentUser().pipe(
    take(1),
    map((user) => {
      if (!user) {
        // No user - redirect to login
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }

      // Check if user has the required role
      // Support both new role field (UserRole enum) and old roles array
      const requiredRoleLower = String(requiredRole).toLowerCase();
      let hasRole = false;

      // Check new role field (UserRole enum)
      if (user.role) {
        const userRoleStr = String(user.role);
        hasRole = 
          (requiredRoleLower === 'admin' && (userRoleStr === UserRole.SUPER_ADMIN || userRoleStr === 'SUPER_ADMIN')) ||
          (requiredRoleLower === 'super_admin' && (userRoleStr === UserRole.SUPER_ADMIN || userRoleStr === 'SUPER_ADMIN')) ||
          (requiredRoleLower === 'event_manager' && (userRoleStr === UserRole.EVENT_MANAGER || userRoleStr === 'EVENT_MANAGER')) ||
          userRoleStr.toLowerCase() === requiredRoleLower;
      }

      // Fallback: check roles array for backward compatibility
      if (!hasRole && user.roles && user.roles.length > 0) {
        hasRole = user.roles.some(
          (role) =>
            role.toLowerCase() === requiredRoleLower ||
            role === requiredRole ||
            (requiredRoleLower === 'admin' && (role === 'ادمین' || role === 'admin' || role === 'SUPER_ADMIN')) ||
            (requiredRoleLower === 'ادمین' && (role === 'ادمین' || role === 'admin' || role === 'SUPER_ADMIN')) ||
            (requiredRoleLower === 'super_admin' && role === 'SUPER_ADMIN') ||
            (requiredRoleLower === 'event_manager' && role === 'EVENT_MANAGER')
        );
      }

      if (!hasRole) {
        // User doesn't have required role - redirect to unauthorized or dashboard
        console.warn(
          `roleGuard: User does not have required role: ${requiredRole}. User role: ${user.role}, roles: ${user.roles}`
        );
        router.navigate(['/dashboard']); // or '/unauthorized'
        return false;
      }

      // User has required role - allow access
      return true;
    })
  );
};

