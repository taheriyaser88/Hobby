import { PaymentMethod, PaymentStatus } from '../enums';

/**
 * پرداخت
 */
export interface Payment {
  id: string | number;
  attendeeId: string | number;
  eventId: string | number;
  amount: number;
  currency: string;
  method: PaymentMethod;             // ONLINE, CASH, ...
  provider?: string;                 // ZARINPAL, IDPAY, ...
  transactionId: string;             // ID تراکنش
  status: PaymentStatus;             // PENDING, SUCCESS, ...
  paidAt?: Date | string;
  refundedAt?: Date | string;
  metadata?: Record<string, any>;    // داده‌های اضافی PSP
  createdAt?: Date | string;
}




