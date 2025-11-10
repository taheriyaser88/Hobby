import { Component } from '@angular/core';

@Component({
  selector: 'app-docs',
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1 style="color: #1a73e8;">📚 مستندات</h1>
      <p style="color: #777; margin: 2rem 0;">
        این صفحه برای نمایش مستندات کلی طراحی شده است.
        <br>
        برای مشاهده نسخه تعاملی، به صفحه <a routerLink="/docs-interactive">مستندات تعاملی</a> بروید.
      </p>
      <a routerLink="/" style="display: inline-block; background: #1a73e8; color: white; padding: 0.8rem 1.5rem; border-radius: 10px; text-decoration: none; margin-top: 2rem;">
        بازگشت به صفحه اصلی
      </a>
    </div>
  `
})
export class DocsComponent {
  
}


