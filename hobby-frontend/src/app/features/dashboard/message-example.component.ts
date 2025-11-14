import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NotificationService } from '../../core/services/notification.service';

/**
 * مثال کامل استفاده از NotificationService
 * Complete example of NotificationService usage
 * 
 * این کامپوننت نشان می‌دهد چگونه از toast تک‌خطی رنگی استفاده کنیم:
 * - Success: بک‌گراند سبز (#52c41a)
 * - Error: بک‌گراند قرمز (#ff4d4f)
 * - Info: بک‌گراند آبی (#1890ff)
 * - Warning: بک‌گراند نارنجی (#faad14)
 * - Loading: بک‌گراند آبی با spinner
 */
@Component({
  standalone: true,
  selector: 'app-message-example',
  imports: [CommonModule, NzButtonModule],
  template: `
    <div class="message-example">
      <h2>مثال Toast تک‌خطی رنگی</h2>
      <p class="description">
        تمام toast ها تک‌خطی هستند با بک‌گراند رنگی و آیکون مناسب.
        انیمیشن از راست می‌آید (در RTL یعنی از چپ).
      </p>
      
      <div class="button-group">
        <button 
          nz-button 
          nzType="primary" 
          (click)="showSuccess()"
          class="btn-success"
        >
          ✅ Success (سبز)
        </button>
        
        <button 
          nz-button 
          nzType="default" 
          nzDanger
          (click)="showError()"
          class="btn-error"
        >
          ❌ Error (قرمز)
        </button>
        
        <button 
          nz-button 
          nzType="default" 
          (click)="showInfo()"
          class="btn-info"
        >
          ℹ️ Info (آبی)
        </button>
        
        <button 
          nz-button 
          nzType="default" 
          (click)="showWarning()"
          class="btn-warning"
        >
          ⚠️ Warning (نارنجی)
        </button>
        
        <button 
          nz-button 
          nzType="default" 
          (click)="showLoading()"
          class="btn-loading"
        >
          🔄 Loading
        </button>
        
        <button 
          nz-button 
          nzType="default" 
          (click)="showMultiple()"
        >
          📦 نمایش چندتایی
        </button>
      </div>
    </div>
  `,
  styles: [`
    .message-example {
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      margin: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #1a73e8;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .description {
      color: #777;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    button {
      min-width: 150px;
      font-weight: 500;
    }

    .btn-success {
      background-color: #52c41a !important;
      border-color: #52c41a !important;
      color: #fff !important;
    }

    .btn-error {
      background-color: #ff4d4f !important;
      border-color: #ff4d4f !important;
      color: #fff !important;
    }

    .btn-info {
      background-color: #1890ff !important;
      border-color: #1890ff !important;
      color: #fff !important;
    }

    .btn-warning {
      background-color: #faad14 !important;
      border-color: #faad14 !important;
      color: #fff !important;
    }

    .btn-loading {
      background-color: #1890ff !important;
      border-color: #1890ff !important;
      color: #fff !important;
    }

    @media (max-width: 768px) {
      .button-group {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `]
})
export class MessageExampleComponent {
  private readonly notification = inject(NotificationService);
  private loadingMessageId: string | null = null;

  /**
   * نمایش پیام موفقیت - بک‌گراند سبز
   */
  showSuccess(): void {
    this.notification.success('عملیات با موفقیت انجام شد!');
  }

  /**
   * نمایش پیام خطا - بک‌گراند قرمز
   */
  showError(): void {
    this.notification.error('خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
  }

  /**
   * نمایش پیام اطلاعات - بک‌گراند آبی
   */
  showInfo(): void {
    this.notification.info('این یک پیام اطلاعاتی است.');
  }

  /**
   * نمایش پیام هشدار - بک‌گراند نارنجی
   */
  showWarning(): void {
    this.notification.warning('لطفاً توجه کنید: این یک هشدار است.');
  }

  /**
   * نمایش loading - بک‌گراند آبی با spinner
   */
  showLoading(): void {
    // اگر قبلاً loading نمایش داده شده، آن را ببند
    if (this.loadingMessageId) {
      this.notification.remove(this.loadingMessageId);
    }
    
    // نمایش loading
    this.loadingMessageId = this.notification.loading('در حال بارگذاری...');
    
    // بعد از 2 ثانیه loading را ببند و success نشان بده
    setTimeout(() => {
      if (this.loadingMessageId) {
        this.notification.remove(this.loadingMessageId);
        this.loadingMessageId = null;
        this.notification.success('بارگذاری با موفقیت انجام شد!');
      }
    }, 2000);
  }

  /**
   * نمایش چند پیام پشت سر هم
   */
  showMultiple(): void {
    this.notification.success('پیام اول: موفقیت!');
    
    setTimeout(() => {
      this.notification.info('پیام دوم: اطلاعات');
    }, 500);
    
    setTimeout(() => {
      this.notification.warning('پیام سوم: هشدار');
    }, 1000);
    
    setTimeout(() => {
      this.notification.error('پیام چهارم: خطا');
    }, 1500);
  }
}

