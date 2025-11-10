import { Component } from '@angular/core';

@Component({
  selector: 'app-docs-interactive',
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1 style="color: #1a73e8;">📖 مستندات تعاملی</h1>
      <p style="color: #777; margin: 2rem 0;">
        این صفحه برای نمایش مستندات تعاملی طراحی شده است.
        <br>
        مستندات کامل شامل نمودارها، API ها و جزییات پیاده‌سازی در این بخش قرار می‌گیرد.
      </p>
      <a routerLink="/" style="display: inline-block; background: #1a73e8; color: white; padding: 0.8rem 1.5rem; border-radius: 10px; text-decoration: none; margin-top: 2rem;">
        بازگشت به صفحه اصلی
      </a>
    </div>
  `
})
export class DocsInteractiveComponent {
  
}


