/**
 * بلیت رویداد
 */
export interface Ticket {
  id: string | number;
  eventId: string | number;
  name: string;                      // نام بلیت
  description?: string;              // توضیحات
  price: number;                     // قیمت
  currency: string;                  // IRR, USD, ...
  quantity: number;                  // ظرفیت
  soldCount: number;                 // فروخته شده
  saleStart?: Date | string;         // شروع فروش
  saleEnd?: Date | string;           // پایان فروش
  visibility: 'PUBLIC' | 'PRIVATE';  // عمومی/خصوصی
  minPurchase?: number;              // حداقل خرید
  maxPurchase?: number;              // حداکثر خرید
  benefits?: string[];               // امتیازات بلیت
}




