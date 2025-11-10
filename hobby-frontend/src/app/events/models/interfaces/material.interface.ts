/**
 * فایل و لینک (مثلاً برای جلسات)
 */
export interface Material {
  type: 'FILE' | 'LINK' | 'VIDEO';
  name: string;
  url: string;
  size?: number;                // حجم فایل (bytes)
  mimeType?: string;            // نوع فایل
}




