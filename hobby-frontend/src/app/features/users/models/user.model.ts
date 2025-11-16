/**
 * User model for users feature module
 */
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles: string[];
  createdAt?: string;
}


