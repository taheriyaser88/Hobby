import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserRole, UserStatus } from '../../models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  user: Partial<User> = {
    fullName: '',
    email: '',
    phone: '',
    role: UserRole.STAFF,
    status: UserStatus.ACTIVE
  };
  isEditMode = false;
  UserRole = UserRole;
  UserStatus = UserStatus;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      console.log('Route params:', params, 'userId:', userId);
      
      if (userId && userId !== 'new') {
        this.isEditMode = true;
        // Convert string to number if it's a numeric string
        const numericId = !isNaN(Number(userId)) ? Number(userId) : userId;
        this.loadUser(numericId);
      } else {
        // Reset form for new user
        this.user = {
          fullName: '',
          email: '',
          phone: '',
          role: UserRole.STAFF,
          status: UserStatus.ACTIVE
        };
        this.isEditMode = false;
      }
    });
  }

  loadUser(id: string | number) {
    // Convert to number if it's a valid number string
    const userId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
    const loadedUser = this.userService.getUserById(userId);
    if (loadedUser) {
      this.user = { 
        ...loadedUser,
        id: loadedUser.id,
        fullName: loadedUser.fullName,
        email: loadedUser.email,
        phone: loadedUser.phone || '',
        role: loadedUser.role,
        status: loadedUser.status
      };
      console.log('Loaded user:', this.user);
    } else {
      console.error('User not found with ID:', id, 'Type:', typeof id);
      console.log('All users:', this.userService.getUsers());
      alert(`کاربر با شناسه ${id} یافت نشد`);
      this.router.navigate(['/users']);
    }
  }

  onSubmit() {
    if (!this.user.fullName || !this.user.fullName.trim()) {
      alert('لطفاً نام کامل را وارد کنید.');
      return;
    }

    if (!this.user.email || !this.user.email.trim()) {
      alert('لطفاً ایمیل را وارد کنید.');
      return;
    }

    // اعتبارسنجی ایمیل ساده
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      alert('لطفاً یک ایمیل معتبر وارد کنید.');
      return;
    }

    if (!this.user.role) {
      alert('لطفاً نقش کاربر را انتخاب کنید.');
      return;
    }

    if (!this.user.status) {
      alert('لطفاً وضعیت کاربر را انتخاب کنید.');
      return;
    }

    try {
      const savedUser = this.userService.saveUser(this.user);
      alert(this.isEditMode ? 'کاربر با موفقیت به‌روزرسانی شد!' : 'کاربر با موفقیت ایجاد شد!');
      if (savedUser && savedUser.id) {
        // Navigate to user detail page after save
        this.router.navigate(['/users', savedUser.id]).catch(err => {
          console.error('Navigation error:', err);
          this.router.navigate(['/users']);
        });
      } else {
        this.router.navigate(['/users']);
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(error.message || 'خطا در ذخیره کاربر');
    }
  }

  cancel() {
    this.router.navigate(['/users']);
  }

  getRoleText(role: UserRole): string {
    const roleMap: any = {
      [UserRole.ADMIN]: 'مدیر',
      [UserRole.ORGANIZER]: 'برگزارکننده',
      [UserRole.STAFF]: 'کارمند'
    };
    return roleMap[role] || role;
  }

  getStatusText(status: UserStatus): string {
    const statusMap: any = {
      [UserStatus.ACTIVE]: 'فعال',
      [UserStatus.INACTIVE]: 'غیرفعال',
      [UserStatus.SUSPENDED]: 'معلق'
    };
    return statusMap[status] || status;
  }
}

