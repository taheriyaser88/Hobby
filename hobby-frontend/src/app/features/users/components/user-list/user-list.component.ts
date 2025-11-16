import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../user.service';

/**
 * User List Component
 * Displays list of users in table (desktop) or vertical list (mobile)
 * Mobile-first design
 */
@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Load all users
   */
  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService
      .getUsers()
      .pipe(
        catchError((err) => {
          console.error('Error loading users:', err);
          this.error.set('خطا در بارگذاری کاربران');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((users) => {
        this.users.set(users);
      });
  }

  /**
   * Navigate to create user page
   */
  onCreateUser(): void {
    this.router.navigate(['/dashboard/users/new']);
  }

  /**
   * Navigate to edit user page
   */
  onEditUser(id: string): void {
    this.router.navigate(['/dashboard/users', id, 'edit']);
  }

  /**
   * Delete user
   */
  onDeleteUser(user: User): void {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید کاربر "${user.name}" را حذف کنید؟`)) {
      return;
    }

    this.userService
      .deleteUser(user.id)
      .pipe(
        catchError((err) => {
          console.error('Error deleting user:', err);
          alert('خطا در حذف کاربر');
          return of(null);
        })
      )
      .subscribe(() => {
        this.loadUsers(); // Reload users after deletion
      });
  }

  /**
   * Format date for display
   */
  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  /**
   * Format roles for display
   */
  formatRoles(roles: string[]): string {
    if (!roles || roles.length === 0) return '-';
    return roles.join('، ');
  }
}


