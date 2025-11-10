import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../users/services/user.service';
import { UserRole, UserStatus } from '../../users/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginTab = true;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // چک می‌کنیم که آیا قبلاً login شده یا نه
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleTab(isLogin: boolean) {
    this.isLoginTab = isLogin;
  }

  // Login
  onLogin(formData: any) {
    const email = formData.email;
    const password = formData.password;
    
    // چک می‌کنیم که کاربر وجود داره یا نه
    const existingUsers = this.userService.getUsers();
    let user = existingUsers.find((u: any) => u.email === email);
    
    // اگر کاربر وجود نداشت، به عنوان ADMIN ایجاد کن
    if (!user) {
      // ایجاد کاربر جدید با نقش ADMIN و وضعیت ACTIVE
      user = this.userService.saveUser({
        fullName: email.split('@')[0], // از ایمیل نام می‌سازیم
        email: email,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE
      });
    }
    
    // ذخیره به عنوان کاربر فعلی (برای session)
    const currentUserSession = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUserSession));
    
    alert('خوش آمدید ' + user.fullName + '!');
    this.router.navigate(['/dashboard']);
  }

  // Signup
  onSignup(formData: any) {
    // چک می‌کنیم که این ایمیل قبلاً ثبت نشده
    const existingUsers = this.userService.getUsers();
    const exists = existingUsers.some((u: any) => u.email === formData.email);
    
    if (exists) {
      alert('این ایمیل قبلاً ثبت شده است!');
      return;
    }
    
    // ایجاد کاربر جدید با نقش ADMIN و وضعیت ACTIVE
    const newUser = this.userService.saveUser({
      fullName: formData.name,
      email: formData.email,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phone: formData.phone || undefined
    });
    
    // ذخیره به عنوان کاربر فعلی (برای session)
    const currentUserSession = {
      id: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUserSession));
    
    alert('ثبت‌نام با موفقیت انجام شد! خوش آمدید ' + newUser.fullName);
    this.router.navigate(['/dashboard']);
  }

  googleLogin() {
    alert('ورود با Google فعال خواهد شد (OAuth2 Integration)');
  }
}

