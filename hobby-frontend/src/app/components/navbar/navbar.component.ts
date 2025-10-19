import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">
            <a routerLink="/" class="brand-link">Hobby Manager</a>
          </div>
          
          <div class="nav-links" *ngIf="currentUser; else loginSection">
            <a routerLink="/dashboard">Dashboard</a>
            <div class="user-menu">
              <img 
                [src]="currentUser.profilePicture || '/assets/default-avatar.png'" 
                [alt]="currentUser.firstName"
                class="user-avatar"
              >
              <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
              <button (click)="logout()" class="btn btn-secondary">Logout</button>
            </div>
          </div>
          
          <ng-template #loginSection>
            <div class="nav-links">
              <a routerLink="/login" class="btn btn-primary">Login</a>
            </div>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-brand .brand-link {
      font-size: 24px;
      font-weight: bold;
      color: #1976d2;
      text-decoration: none;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .user-name {
      font-weight: 500;
      color: #333;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

