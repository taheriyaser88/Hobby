import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <!-- Header -->
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Hobby Manager</h1>
            <p class="text-gray-600 text-base leading-relaxed mb-8">
              Sign in to manage your hobbies and connect with others
            </p>
          </div>
          
          <!-- Login Options -->
          <div class="space-y-6">
            <!-- Error Message -->
            <div *ngIf="errorMessage" 
                 class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
            
            <!-- Google Login Button -->
            <button 
              (click)="loginWithGoogle()" 
              [disabled]="isLoading"
              class="w-full flex justify-center items-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <span *ngIf="!isLoading" class="mr-3 text-xl">🔗</span>
              <span *ngIf="isLoading" class="mr-3 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
            </button>
          </div>
          
          <!-- Footer -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-500 leading-relaxed">
              By signing in, you agree to our 
              <a href="#" class="text-primary-600 hover:text-primary-500 font-medium">Terms of Service</a> 
              and 
              <a href="#" class="text-primary-600 hover:text-primary-500 font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for error parameters
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'true') {
        this.errorMessage = params['message'] || 'Authentication failed. Please try again.';
      }
    });
    
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    this.authService.loginWithGoogle();
  }
}

