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
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Brand -->
          <div class="flex-shrink-0">
            <a routerLink="/" class="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-300">
              Hobby Manager
            </a>
          </div>
          
          <!-- Navigation Links -->
          <div class="flex items-center space-x-4" *ngIf="currentUser; else loginSection">
            <a routerLink="/dashboard" 
               class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
              Dashboard
            </a>
            
            <!-- User Menu -->
            <div class="flex items-center space-x-3">
              <img 
                [src]="currentUser.profilePicture || '/assets/default-avatar.png'" 
                [alt]="currentUser.firstName"
                class="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              >
              <span class="text-sm font-medium text-gray-700">
                {{ currentUser.firstName }} {{ currentUser.lastName }}
              </span>
              <button (click)="logout()" 
                      class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Logout
              </button>
            </div>
          </div>
          
          <!-- Login Section -->
          <ng-template #loginSection>
            <div class="flex items-center">
              <a routerLink="/login" 
                 class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                Login
              </a>
            </div>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: []
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

