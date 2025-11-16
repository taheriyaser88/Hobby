import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserService } from '../../user.service';

/**
 * User Form Component
 * Create/Edit user form with ReactiveForms
 * Mobile-first design: single column on mobile, two columns on desktop
 */
@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly isEditMode = signal(false);
  readonly userId = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  // Available roles
  readonly availableRoles = ['ادمین', 'سازمان‌دهنده', 'کاربر'];

  // Form
  userForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserIfEditMode();
  }

  /**
   * Initialize reactive form
   */
  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }], // Email is always disabled (read-only)
      picture: [''],
      roles: [[], Validators.required],
    });
  }

  /**
   * Load user data if in edit mode
   */
  private loadUserIfEditMode(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId && userId !== 'new') {
      this.isEditMode.set(true);
      this.userId.set(userId);
      this.loading.set(true);

      this.userService
        .getUserById(userId)
        .pipe(
          catchError((err) => {
            console.error('Error loading user:', err);
            this.error.set('خطا در بارگذاری کاربر');
            return of(null);
          }),
          finalize(() => this.loading.set(false))
        )
        .subscribe((user) => {
          if (user) {
            this.populateForm(user);
          }
        });
    }
  }

  /**
   * Populate form with user data
   */
  private populateForm(user: User): void {
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      picture: user.picture || '',
      roles: user.roles || [],
    });
  }

  /**
   * Toggle role in roles array
   */
  toggleRole(role: string): void {
    const currentRoles = this.userForm.get('roles')?.value || [];
    const index = currentRoles.indexOf(role);

    if (index > -1) {
      // Remove role
      currentRoles.splice(index, 1);
    } else {
      // Add role
      currentRoles.push(role);
    }

    this.userForm.patchValue({ roles: currentRoles });
  }

  /**
   * Check if role is selected
   */
  isRoleSelected(role: string): boolean {
    const roles = this.userForm.get('roles')?.value || [];
    return roles.includes(role);
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    if (this.userForm.invalid) {
      // Mark all fields as touched
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.userForm.getRawValue(); // Get raw value to include disabled fields
    const userData: Omit<User, 'id' | 'createdAt'> = {
      name: formValue.name,
      email: formValue.email,
      picture: formValue.picture || undefined,
      roles: formValue.roles,
    };

    const operation = this.isEditMode()
      ? this.userService.updateUser(this.userId()!, userData)
      : this.userService.createUser(userData);

    operation
      .pipe(
        catchError((err) => {
          console.error('Error saving user:', err);
          this.error.set('خطا در ذخیره کاربر');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((user) => {
        if (user) {
          this.router.navigate(['/dashboard/users']);
        }
      });
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.router.navigate(['/dashboard/users']);
  }

  /**
   * Get form field error
   */
  getFieldError(fieldName: string): string | null {
    const field = this.userForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) {
        return 'این فیلد الزامی است';
      }
      if (field.errors['minlength']) {
        return `حداقل ${field.errors['minlength'].requiredLength} کاراکتر لازم است`;
      }
    }
    return null;
  }
}


