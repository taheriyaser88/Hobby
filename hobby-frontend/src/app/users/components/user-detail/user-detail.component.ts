import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserStatus } from '../../models';
import { formatPersianDate } from '../../../shared/utils/persian-utils';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        // Convert string to number if it's a valid number
        const numericId = !isNaN(Number(userId)) ? Number(userId) : userId;
        this.loadUser(numericId);
      } else {
        this.router.navigate(['/users']);
      }
    });
  }

  loadUser(id: string | number) {
    const loadedUser = this.userService.getUserById(id);
    if (loadedUser) {
      this.user = loadedUser;
    } else {
      console.error('User not found with ID:', id, 'Type:', typeof id);
      console.log('All users:', this.userService.getUsers());
      alert(`کاربر با شناسه ${id} یافت نشد`);
      this.router.navigate(['/users']);
    }
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

  onEdit() {
    this.router.navigate(['/users', 'edit', this.user?.id]);
  }

  onDelete() {
    if (confirm(`آیا از حذف کاربر "${this.user?.fullName}" اطمینان دارید؟`)) {
      if (this.user) {
        this.userService.deleteUser(this.user.id);
        this.router.navigate(['/users']);
      }
    }
  }

  onBack() {
    this.router.navigate(['/users']);
  }

  getCreatedDate(createdAt: string | Date | undefined): string {
    if (!createdAt) return '—';
    return formatPersianDate(createdAt);
  }

  getUpdatedDate(updatedAt: string | Date | undefined): string {
    if (!updatedAt) return '—';
    return formatPersianDate(updatedAt);
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

