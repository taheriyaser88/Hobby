import { Injectable } from '@angular/core';
import { User, UserRole, UserStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';

  getUsers(): User[] {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed as User[];
        }
      } catch (e) {
        console.warn('[UserService] Failed to parse users from localStorage.', e);
      }
    }
    const defaults = this.getDefaultUsers();
    localStorage.setItem(this.storageKey, JSON.stringify(defaults));
    return defaults;
  }

  getUserById(id: number | string): User | undefined {
    if (!id) return undefined;
    const users = this.getUsers();
    // Try exact match first
    let user = users.find(u => u.id === id);
    if (user) return user;
    // Try string comparison
    user = users.find(u => String(u.id) === String(id));
    if (user) return user;
    // Try number comparison
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (!isNaN(numId)) {
      user = users.find(u => {
        const uNumId = typeof u.id === 'string' ? parseInt(u.id, 10) : u.id;
        return uNumId === numId;
      });
    }
    return user;
  }

  saveUser(user: Partial<User>): User {
    const users = this.getUsers();
    if (user.id) {
      // Update existing user
      const index = users.findIndex(u => u.id === user.id || u.id === String(user.id));
      if (index !== -1) {
        const existingUser = users[index];
        const updatedUser: User = {
          ...existingUser,
          ...user,
          id: existingUser.id, // Keep original ID
          fullName: user.fullName ?? existingUser.fullName,
          email: user.email ?? existingUser.email,
          role: user.role ?? existingUser.role,
          status: user.status ?? existingUser.status,
          phone: user.phone ?? existingUser.phone,
          avatarUrl: user.avatarUrl ?? existingUser.avatarUrl,
          createdAt: existingUser.createdAt, // Keep original createdAt
          updatedAt: new Date().toISOString()
        };
        users[index] = updatedUser;
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        console.log('Updated user:', updatedUser);
        return updatedUser;
      } else {
        console.warn('User not found for update:', user.id);
      }
    }
    // Create new user
    if (!user.fullName || !user.email || !user.role) {
      throw new Error('Cannot create user: missing required fields (fullName, email, role)');
    }
    const newUser: User = {
      id: Date.now(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status || UserStatus.ACTIVE,
      avatarUrl: user.avatarUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return newUser;
  }

  deleteUser(id: number | string): void {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id && u.id !== String(id));
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: 1,
        fullName: 'سارا جعفری',
        email: 'sara@example.com',
        phone: '09123456789',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        fullName: 'علی محمدی',
        email: 'ali@example.com',
        phone: '09123456790',
        role: UserRole.ORGANIZER,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      },
      {
        id: 3,
        fullName: 'الهام رضایی',
        email: 'elham@example.com',
        phone: '09123456791',
        role: UserRole.STAFF,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z'
      }
    ];
  }
}

