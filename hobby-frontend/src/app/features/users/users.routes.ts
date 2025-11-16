import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { roleGuard } from '../../core/auth/role.guard';
import { UsersPageListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

/**
 * Users Routes
 * All routes require authentication and admin role
 */
export const usersRoutes: Routes = [
  {
    path: '',
    component: UsersPageListComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'admin' },
  },
  {
    path: 'new',
    component: UserFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'admin' },
  },
  {
    path: ':id/edit',
    component: UserFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'admin' },
  },
  {
    path: ':id',
    component: UserDetailsComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'admin' },
  },
];


