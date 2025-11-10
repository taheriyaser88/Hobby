/**
 * مکان رویداد
 */
export interface Location {
  address: string;              // آدرس کامل
  city?: string;                // شهر
  province?: string;            // استان
  country?: string;             // کشور
  lat?: number;                 // عرض جغرافیایی
  lng?: number;                 // طول جغرافیایی
  venue?: string;               // نام محل برگزاری
  directions?: string;          // دسترسی
}




