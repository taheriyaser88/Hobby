import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';

interface UserView {
  id: string;
  fullName: string;
  email: string;
}

@Component({
  standalone: true,
  selector: 'app-users-page-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UsersPageListComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  users: UserView[] = [];
  isLoading = false;
  isError = false;

  searchQuery = '';
  page = 1;
  pageSize = 10;
  total = 0;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  onSearch(): void {
    this.page = 1;
    this.loadUsers();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  reload(): void {
    this.loadUsers();
  }

  onCreateUser(): void {
    this.router.navigate(['/dashboard/users/new']);
  }

  editUser(u: UserView): void {
    this.router.navigate(['/dashboard/users', u.id, 'edit']);
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.isError = false;
    this.userService
      .getUsersPaged({
        page: this.page,
        size: this.pageSize,
        search: this.searchQuery?.trim() || '',
      })
      .subscribe({
        next: (res) => {
          this.users = (res.items || []).map((u: any) => ({
            id: String(u.id),
            fullName: u.fullName || u.name || '',
            email: u.email || '',
          }));
          this.total = res.total || 0;
          this.page = res.page || 1;
          this.pageSize = res.size || this.pageSize;
          this.isLoading = false;
        },
        error: () => {
          this.isError = true;
          this.isLoading = false;
        },
      });
  }
}


