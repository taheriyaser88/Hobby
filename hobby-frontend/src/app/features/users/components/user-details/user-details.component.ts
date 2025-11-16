import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../user.service';

/**
 * User Details Component
 * Display user details in read-only mode
 * Mobile-first design
 */
@Component({
  standalone: true,
  selector: 'app-user-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  private readonly userService = inject(UserService);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    } else {
      this.error.set('شناسه کاربر مشخص نشده است');
      this.loading.set(false);
    }
  }

  /**
   * Load user by ID
   */
  private loadUser(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService
      .getUserById(id)
      .pipe(
        catchError((err) => {
          console.error('Error loading user:', err);
          this.error.set('خطا در بارگذاری کاربر');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((user) => {
        this.user.set(user);
      });
  }

  /**
   * Navigate to edit page
   */
  onEdit(): void {
    const user = this.user();
    if (user) {
      this.router.navigate(['/dashboard/users', user.id, 'edit']);
    }
  }

  /**
   * Delete user
   */
  onDelete(): void {
    const user = this.user();
    if (!user) return;

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
        this.router.navigate(['/dashboard/users']);
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

