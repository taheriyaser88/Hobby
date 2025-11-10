import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-event-settings',
  standalone: true,
  imports: [],
  templateUrl: './event-settings.component.html',
  styleUrls: ['../event-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventSettingsComponent {

  saveSettings() {
    const title = (document.getElementById('evtTitle') as HTMLInputElement)?.value;
    const desc = (document.getElementById('evtDesc') as HTMLTextAreaElement)?.value;
    alert('تنظیمات ذخیره شد:\n' + title + '\n' + desc);
  }
}
