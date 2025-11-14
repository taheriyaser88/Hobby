import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { fa_IR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fa from '@angular/common/locales/fa';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideNzConfig, NzConfig } from 'ng-zorro-antd/core/config';

// Register locale data
registerLocaleData(fa);

// Configure ng-zorro message - تک‌خطی رنگی RTL
const ngZorroConfig: Partial<NzConfig> = {
  message: {
    nzTop: 24,
    nzDuration: 3000, // مدت زمان نمایش (میلی‌ثانیه)
    nzPauseOnHover: true,
    nzAnimate: true, // Enable animations for smooth appearance
    nzMaxStack: 5,
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(fa_IR),
    provideAnimationsAsync(), // Async animations to prevent UI freeze - CRITICAL for performance
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNzConfig(ngZorroConfig) // NG-ZORRO global config for notification/message
    // Note: NG-ZORRO includes icons by default (CheckCircleOutline, CloseCircleOutline, etc.)
    // No need to provideNzIcons unless using custom icons
  ]
};
