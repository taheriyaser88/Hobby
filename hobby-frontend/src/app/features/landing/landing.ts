import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  ngOnInit(): void {
    this.checkLoginError();
  }

  private checkLoginError(): void {
    // Check URL directly
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const statusParam = urlParams.get('status');
    const token = urlParams.get('token');
    
    console.log('Landing - Error param:', errorParam);
    console.log('Landing - Status param:', statusParam);
    console.log('Landing - Token:', token ? 'exists' : 'missing');
    console.log('Landing - Full URL:', window.location.href);
    
    // If there's an error parameter, show error toast immediately
    if (errorParam === 'true' || errorParam === '') {
      // Show error message - تک‌خطی رنگی
      this.notification.error(
        'ورود با خطا مواجه شد. لطفاً دوباره تلاش کنید یا با مدیر سیستم تماس بگیرید.'
      );
      
      // Clean URL after a short delay to ensure notification is visible
      setTimeout(() => {
        this.router.navigate(['/'], { replaceUrl: true });
      }, 100);
      return;
    }
    
    // If status is success, save token and redirect to dashboard
    if (statusParam === 'success') {
      if (token) {
        // Save token to localStorage
        localStorage.setItem('auth_token', token);
        console.log('JWT token saved to localStorage from landing');
        
        // Decode token to get user name (will show toast in dashboard)
        // Just redirect to dashboard, it will handle the toast
      }
      
      // Redirect to dashboard immediately
      this.router.navigate(['/dashboard'], { 
        replaceUrl: true,
        queryParams: { login: 'success', token: token || undefined }
      }).catch(() => {
        // Fallback: redirect without query params
        window.location.href = '/dashboard?login=success' + (token ? '&token=' + encodeURIComponent(token) : '');
      });
    }
  }
}
