import { User } from './user.model';

/**
 * Authentication response model from backend after successful OAuth login
 */
export interface AuthResponse {
  accessToken: string;
  user: User;
}






