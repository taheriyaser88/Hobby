import { Pipe, PipeTransform } from '@angular/core';
import { formatPersianDate } from '../utils/persian-utils';

/**
 * Pipe برای تبدیل تاریخ به فارسی
 * استفاده: {{ date | persianDate }}
 */
@Pipe({
  name: 'persianDate',
  standalone: true
})
export class PersianDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    return formatPersianDate(value);
  }
}


