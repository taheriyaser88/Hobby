import { UserRole } from '../enums/user-role.enum';

/**
 * User model representing authenticated user information
 */
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt?: Date;
}






