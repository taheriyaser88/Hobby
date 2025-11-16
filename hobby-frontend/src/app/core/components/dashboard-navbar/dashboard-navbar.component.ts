import { Component, signal, inject, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/models/user.model';
import { UserRole } from '../../enums/user-role.enum';
import { NotificationService } from '../../services/notification.service';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Dashboard Navbar Component
 * Navbar با logo و user menu برای dashboard
 * Mobile-first design با استایل EventBuilderUi
 */
@Component({
  standalone: true,
  selector: 'app-dashboard-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss'],
  host: {
    '[style.display]': '"block"',
    '[style.width]': '"100%"',
    '[style.min-height]': '"60px"'
  }
})
export class DashboardNavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  @ViewChild('userMenuWrapper', { static: false }) userMenuWrapper?: ElementRef;

  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly showUserMenu = signal(false);
  readonly showMobileMenu = signal(false);
  
  private clickSubscription?: Subscription;
  private userSubscription?: Subscription;

  ngOnInit(): void {
    // Subscribe to current user from AuthService
    this.userSubscription = this.authService.getCurrentUser().subscribe((user) => {
      this.user.set(user);
      this.loading.set(false);
    });

    // Load initial user data
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser) {
      this.user.set(currentUser);
      this.loading.set(false);
    } else {
      this.loading.set(false);
    }
  }

  ngAfterViewInit(): void {
    this.setupClickOutsideListener();
  }

  ngOnDestroy(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private setupClickOutsideListener(): void {
    // Listen to document clicks to close user menu when clicking outside
    // استفاده از setTimeout برای اطمینان از اینکه ViewChild در دسترس است
    setTimeout(() => {
      this.clickSubscription = fromEvent<MouseEvent>(document, 'click')
        .pipe(
          filter(() => this.showUserMenu())
        )
        .subscribe((event) => {
          const target = event.target as Node;
          if (this.userMenuWrapper?.nativeElement && !this.userMenuWrapper.nativeElement.contains(target)) {
            this.closeUserMenu();
          }
        });
    }, 0);
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    const currentUser = this.user();
    if (!currentUser) {
      return false;
    }
    
    // Check new role field (UserRole enum or string)
    if (currentUser.role) {
      const roleStr = String(currentUser.role);
      const isSuperAdmin = roleStr === UserRole.SUPER_ADMIN || roleStr === 'SUPER_ADMIN';
      const isEventManager = roleStr === UserRole.EVENT_MANAGER || roleStr === 'EVENT_MANAGER';
      if (isSuperAdmin || isEventManager) return true;
    }
    
    // Fallback: check roles array for backward compatibility
    if (currentUser.roles && currentUser.roles.length > 0) {
      return currentUser.roles.some(r => {
        const roleStr = String(r);
        return roleStr === 'admin' || 
               roleStr === 'ادمین' || 
               roleStr === 'SUPER_ADMIN' || 
               roleStr === 'EVENT_MANAGER';
      });
    }
    
    return false;
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showUserMenu.update(v => !v);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update(v => !v);
  }

  closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }

  onLogout(): void {
    this.authService.logout();
    this.notification.success('با موفقیت خارج شدید.');
  }

  getUserDisplayName(): string {
    const user = this.user();
    if (!user) return '';
    // Return full name, fallback to email if name is empty
    return user.name || user.email || '';
  }

  getUserInitials(): string {
    const name = this.getUserDisplayName();
    if (!name) return '?';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
}

