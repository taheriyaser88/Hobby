/**
 * Utility functions for Persian formatting
 */

/**
 * تبدیل اعداد به فارسی
 */
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

/**
 * تبدیل تاریخ میلادی به شمسی
 */
export function gregorianToPersian(dateString: string | Date): { year: number; month: number; day: number } | null {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();

  // محاسبه روز از ابتدای سال میلادی
  const dayOfYear = getDayOfYear(gregorianYear, gregorianMonth, gregorianDay);
  
  let persianYear: number;
  let persianMonth: number;
  let persianDay: number;

  // محاسبه سال شمسی
  if (dayOfYear <= 79) {
    persianYear = gregorianYear - 621;
    persianMonth = 10;
    persianDay = dayOfYear + 10;
    if (persianDay > 30) {
      persianDay -= 30;
      persianMonth = 11;
    }
  } else {
    persianYear = gregorianYear - 621;
    const persianDayOfYear = dayOfYear - 79;
    
    if (persianDayOfYear <= 186) {
      persianMonth = Math.floor((persianDayOfYear - 1) / 31) + 1;
      persianDay = ((persianDayOfYear - 1) % 31) + 1;
    } else {
      persianMonth = Math.floor((persianDayOfYear - 187) / 30) + 7;
      persianDay = ((persianDayOfYear - 187) % 30) + 1;
    }
  }

  return { year: persianYear, month: persianMonth, day: persianDay };
}

/**
 * فرمت تاریخ به فارسی: "۲۹ مهر ۱۴۰۳"
 */
export function formatPersianDate(dateString: string | Date): string {
  const persian = gregorianToPersian(dateString);
  if (!persian) return '';

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const monthName = persianMonths[persian.month - 1] || '';
  return `${toPersianDigits(persian.day)} ${monthName} ${toPersianDigits(persian.year)}`;
}

/**
 * فرمت زمان به فارسی: "۰۹:۰۰"
 */
export function formatPersianTime(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // تبدیل همه اعداد به فارسی
  const formattedHours = hours < 10 ? `۰${toPersianDigits(hours)}` : toPersianDigits(hours);
  const formattedMinutes = minutes < 10 ? `۰${toPersianDigits(minutes)}` : toPersianDigits(minutes);
  
  return `${formattedHours}:${formattedMinutes}`;
}

/**
 * فرمت عدد با جداکننده هزارگان فارسی
 */
export function formatPersianNumber(num: number | string): string {
  const numStr = num.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  // تبدیل به فارسی و اضافه کردن جداکننده
  let result = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '،');
  result = result.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  
  return result;
}

/**
 * محاسبه روز از ابتدای سال میلادی
 */
function getDayOfYear(year: number, month: number, day: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  if (isLeapYear(year)) {
    daysInMonth[1] = 29;
  }
  
  let dayOfYear = day;
  for (let i = 0; i < month - 1; i++) {
    dayOfYear += daysInMonth[i];
  }
  
  return dayOfYear;
}

/**
 * بررسی سال کبیسه
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * تبدیل تاریخ شمسی به میلادی (تقریبی)
 */
export function persianToGregorian(year: number, month: number, day: number): Date | null {
  if (year < 1300 || year > 1500 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  // تبدیل تقریبی: سال شمسی + 621 = سال میلادی
  const gregorianYear = year + 621;
  
  // تبدیل تقریبی ماه و روز (این یک تبدیل ساده است)
  // برای دقت بیشتر باید از کتابخانه‌های تخصصی استفاده کرد
  const gregorianMonth = Math.max(1, Math.min(12, month + 2));
  const gregorianDay = Math.max(1, Math.min(31, day));

  return new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
}

