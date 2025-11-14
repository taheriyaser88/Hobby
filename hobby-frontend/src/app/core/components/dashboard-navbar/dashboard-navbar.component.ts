import { Component, signal, inject, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';
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

  readonly user = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly showUserMenu = signal(false);
  readonly showMobileMenu = signal(false);
  
  private clickSubscription?: Subscription;

  ngOnInit(): void {
    console.log('DashboardNavbarComponent ngOnInit called');
    
    // Always set a default user immediately to ensure component can render
    // This prevents component from failing to render if API is slow or fails
    this.user.set({
      id: '',
      fullName: 'کاربر',
      email: '',
      avatarUrl: ''
    });
    this.loading.set(false);
    
    // Try to load from token first (synchronous, non-blocking)
    try {
      this.loadUserFromToken();
    } catch (e) {
      console.error('Error loading user from token:', e);
      // Continue with default user
    }
    
    // Try to load from API in background (non-blocking)
    // This will update user data if API call succeeds
    try {
      this.loadUserProfile();
    } catch (e) {
      console.error('Error loading user profile:', e);
      // Don't let API errors prevent component from rendering
    }
    
    console.log('DashboardNavbarComponent ngOnInit completed, user:', this.user());
  }

  ngAfterViewInit(): void {
    this.setupClickOutsideListener();
  }

  ngOnDestroy(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
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

  private loadUserProfile(): void {
    // Don't set loading to true here - we want component to render immediately
    // Try to load from API, but don't fail if it errors
    this.authService.fetchProfile().subscribe({
      next: (profile) => {
        console.log('User profile loaded from API:', profile);
        this.user.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading user profile from API:', err);
        // Don't set loading to false here - we already set it to false in ngOnInit
        // Don't let API errors prevent component from rendering
        // Component should already have user data from token or default
      }
    });
  }

  private loadUserFromToken(): void {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        console.log('Token found, decoding...');
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        this.user.set({
          id: payload.userId || payload.id || '',
          fullName: payload.name || payload.fullName || 'کاربر',
          email: payload.email || '',
          avatarUrl: payload.avatarUrl || payload.picture || ''
        });
        console.log('User set from token:', this.user());
      } else {
        console.log('No token found, using default user');
        // If no token, keep default user (already set in ngOnInit)
      }
    } catch (e) {
      console.error('Error decoding token:', e);
      // Even on error, keep default user (already set in ngOnInit)
    }
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
    localStorage.removeItem('auth_token');
    this.notification.success('با موفقیت خارج شدید.');
    window.location.href = '/';
  }

  getUserDisplayName(): string {
    const user = this.user();
    if (!user) return 'کاربر';
    return user.fullName || user.email || 'کاربر';
  }

  getUserInitials(): string {
    const name = this.getUserDisplayName();
    if (name === 'کاربر') return 'ک';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
}

