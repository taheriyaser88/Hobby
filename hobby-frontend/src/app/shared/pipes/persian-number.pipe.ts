import { Pipe, PipeTransform } from '@angular/core';
import { formatPersianNumber } from '../utils/persian-utils';

/**
 * Pipe برای تبدیل اعداد به فارسی
 * استفاده: {{ number | persianNumber }}
 */
@Pipe({
  name: 'persianNumber',
  standalone: true
})
export class PersianNumberPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) return '۰';
    return formatPersianNumber(value);
  }
}


