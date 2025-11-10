import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserStatus, UserRole } from '../../models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.userService.getUsers();
    this.filteredUsers = this.users;
  }

  onSearch(searchValue: string) {
    this.searchTerm = searchValue;
    if (!searchValue) {
      this.filteredUsers = this.users;
    } else {
      const lowerSearch = searchValue.toLowerCase();
      this.filteredUsers = this.users.filter(user => {
        // جستجو در نام، ایمیل، تلفن
        const nameMatch = user.fullName.toLowerCase().includes(lowerSearch);
        const emailMatch = user.email.toLowerCase().includes(lowerSearch);
        const phoneMatch = user.phone?.toLowerCase().includes(lowerSearch);
        
        // جستجو در وضعیت (فارسی و انگلیسی)
        const statusText = this.getStatusText(user.status).toLowerCase();
        const statusMatch = statusText.includes(lowerSearch) || 
                           user.status.toLowerCase().includes(lowerSearch);
        
        // جستجو در نقش (فارسی و انگلیسی)
        const roleText = this.getRoleText(user.role).toLowerCase();
        const roleMatch = roleText.includes(lowerSearch) || 
                         user.role.toLowerCase().includes(lowerSearch);
        
        return nameMatch || emailMatch || phoneMatch || statusMatch || roleMatch;
      });
    }
  }

  deleteUser(user: User) {
    if (confirm(`آیا از حذف کاربر "${user.fullName}" اطمینان دارید؟`)) {
      this.userService.deleteUser(user.id);
      this.loadUsers();
    }
  }

  viewUser(user: User) {
    if (user && user.id) {
      this.router.navigate(['/users', user.id]).catch(err => {
        console.error('Navigation error:', err);
      });
    }
  }

  editUser(user: User, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/users', 'edit', user.id]);
  }

  getRoleText(role: string): string {
    const roleMap: any = {
      'ADMIN': 'مدیر',
      'ORGANIZER': 'برگزارکننده',
      'STAFF': 'کارمند'
    };
    return roleMap[role] || role;
  }

  getRoleClass(role: string): string {
    const roleLower = role?.toLowerCase() || '';
    if (roleLower === 'admin') {
      return 'role-admin';
    } else if (roleLower === 'organizer') {
      return 'role-organizer';
    } else {
      return 'role-staff';
    }
  }

  getStatusText(status: string): string {
    const statusMap: any = {
      'ACTIVE': 'فعال',
      'INACTIVE': 'غیرفعال',
      'SUSPENDED': 'معلق'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'active') {
      return 'status-active';
    } else if (statusLower === 'inactive') {
      return 'status-inactive';
    } else {
      return 'status-suspended';
    }
  }
}

