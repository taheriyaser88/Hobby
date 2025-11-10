import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  currentRoute: string = '';

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  ngOnInit() {
    this.currentRoute = this.router.url;
  }

  isActive(route: string): boolean {
    if (route === '/dashboard') {
      return this.currentRoute === '/dashboard' || this.currentRoute === '/#/dashboard';
    }
    if (route === '/events') {
      return this.currentRoute.includes('/events');
    }
    if (route === '/tasks') {
      return this.currentRoute.includes('/tasks') && !this.currentRoute.includes('/events');
    }
    return this.currentRoute.includes(route);
  }

  getCurrentPageName(): string {
    const url = this.currentRoute;
    if (url.includes('/tasks/new')) return 'ایجاد وظیفه';
    if (url.includes('/tasks/') && !url.includes('/tasks?')) return 'جزئیات وظیفه';
    if (url.includes('/tasks')) return 'وظایف';
    if (url.includes('/users/new')) return 'ایجاد کاربر';
    if (url.includes('/users/') && !url.includes('/users?')) return 'جزئیات کاربر';
    if (url.includes('/users')) return 'کاربران';
    if (url.includes('/events/new')) return 'ایجاد رویداد';
    if (url.includes('/events/') && !url.includes('/events?')) return 'جزئیات رویداد';
    if (url.includes('/events')) return 'رویدادها';
    if (url.includes('/profile')) return 'پروفایل';
    if (url.includes('/dashboard')) return 'داشبورد';
    return 'داشبورد';
  }

  onClickComingSoon(event: Event) {
    event.preventDefault();
    alert('این بخش در حال راه‌اندازی است و به زودی در دسترس خواهد بود! 🚀');
  }
}
