import { Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * Centralized notification service for consistent toast/message handling
 * استفاده از NzMessage برای toast تک‌خطی رنگی
 * Single-line colored toast messages with RTL support
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly message = inject(NzMessageService);

  /**
   * Show success message - بک‌گراند سبز (#52c41a)
   * تک‌خطی با آیکون check-circle
   */
  success(content: string, duration: number = 3000): void {
    this.message.success(content, { 
      nzDuration: duration,
      nzPauseOnHover: true 
    });
  }

  /**
   * Show error message - بک‌گراند قرمز (#ff4d4f)
   * تک‌خطی با آیکون close-circle
   */
  error(content: string, duration: number = 4000): void {
    this.message.error(content, { 
      nzDuration: duration,
      nzPauseOnHover: true 
    });
  }

  /**
   * Show info message - بک‌گراند آبی (#1890ff)
   * تک‌خطی با آیکون info-circle
   */
  info(content: string, duration: number = 3000): void {
    this.message.info(content, { 
      nzDuration: duration,
      nzPauseOnHover: true 
    });
  }

  /**
   * Show warning message - بک‌گراند نارنجی (#faad14)
   * تک‌خطی با آیکون exclamation-circle
   */
  warning(content: string, duration: number = 4000): void {
    this.message.warning(content, { 
      nzDuration: duration,
      nzPauseOnHover: true 
    });
  }

  /**
   * Show loading message - بک‌گراند آبی (#1890ff)
   * تک‌خطی با آیکون loading (spinner)
   * @returns messageId برای بستن بعداً
   */
  loading(content: string, duration: number = 0): string {
    return this.message.loading(content, { 
      nzDuration: duration,
      nzPauseOnHover: false 
    }).messageId;
  }

  /**
   * Remove message by ID
   * بستن message با استفاده از messageId
   */
  remove(messageId: string): void {
    this.message.remove(messageId);
  }

  // Legacy methods for backward compatibility
  /**
   * @deprecated Use success() instead
   */
  successMessage(content: string, duration: number = 3000): void {
    this.success(content, duration);
  }

  /**
   * @deprecated Use error() instead
   */
  errorMessage(content: string, duration: number = 3000): void {
    this.error(content, duration);
  }
}

