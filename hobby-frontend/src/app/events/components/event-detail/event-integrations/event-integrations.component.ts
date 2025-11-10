import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-event-integrations',
  standalone: true,
  imports: [],
  templateUrl: './event-integrations.component.html',
  styleUrls: ['../event-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventIntegrationsComponent {

  openGoogleConnect() {
    alert('می‌خواهید حساب Google را متصل کنید؟ (شبیه‌سازی)');
  }

  syncGoogleCalendar() {
    alert('همگام‌سازی با Google Calendar شروع شد (شبیه‌سازی).');
  }

  createGoogleMeet() {
    alert('لینک Google Meet برای جلسه ایجاد شد: https://meet.google.com/xxx (شبیه‌سازی).');
  }
}
