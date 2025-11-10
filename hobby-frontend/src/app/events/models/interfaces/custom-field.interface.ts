/**
 * فیلد سفارشی
 */
export interface CustomField {
  id: string;
  label: string;
  type: 'TEXT' | 'NUMBER' | 'EMAIL' | 'PHONE' | 'SELECT' | 'CHECKBOX' | 'DATE';
  required: boolean;
  options?: string[];           // برای SELECT
  placeholder?: string;
  validation?: string;          // regex یا rule
}




