import { UserRole } from '../../enums/user-role.enum';

/**
 * User model representing authenticated user information
 */
export interface User {
  id: number | string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  roles?: string[]; // Keep for backward compatibility
}

