import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: any = null;
  currentUrl: string = '';
  router: Router;
  showProfileMenu: boolean = false;

  constructor(private _router: Router) {
    this.router = _router;
    
    // گوش دادن به تغییرات route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit() {
    // دریافت اطلاعات کاربر فعلی
    this.loadCurrentUser();
    
    // گوش دادن به تغییرات localStorage برای به‌روزرسانی خودکار
    window.addEventListener('storage', () => {
      this.loadCurrentUser();
    });
    
    // بستن منو با کلیک خارج از آن
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-info-wrapper')) {
        this.closeProfileMenu();
      }
    });
    
    this.currentUrl = this.router.url;
  }

  loadCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing currentUser:', e);
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  getCurrentPageName(): string {
    const url = this.currentUrl;
    if (url.includes('/events/new')) return 'ایجاد رویداد';
    if (url.includes('/events/') && !url.includes('/events?')) return 'جزئیات رویداد';
    if (url.includes('/events')) return 'رویدادها';
    if (url.includes('/profile')) return 'پروفایل';
    if (url.includes('/dashboard')) return 'داشبورد';
    return 'داشبورد';
  }

  toggleProfileMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showProfileMenu = false;
  }

  navigateToProfile(route: string) {
    this.closeProfileMenu();
    this.router.navigate([route]);
  }

  changePassword() {
    this.closeProfileMenu();
    alert('تغییر رمز عبور: این قابلیت به زودی اضافه خواهد شد.');
  }

  showNotifications() {
    this.closeProfileMenu();
    alert('اطلاع‌رسانی‌ها: این قابلیت به زودی اضافه خواهد شد.');
  }

  editProfile() {
    this.closeProfileMenu();
    if (this.currentUser && this.currentUser.id) {
      this.router.navigate(['/users', 'edit', this.currentUser.id]);
    } else {
      this.router.navigate(['/profile']);
    }
  }

  logout() {
    this.closeProfileMenu();
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}

