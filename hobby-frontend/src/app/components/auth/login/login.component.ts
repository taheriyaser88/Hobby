import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Welcome to Hobby Manager</h1>
        <p class="auth-subtitle">Sign in to manage your hobbies and connect with others</p>
        
        <div class="login-options">
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <button 
            (click)="loginWithGoogle()" 
            class="btn btn-google btn-large"
            [disabled]="isLoading"
          >
            <span *ngIf="!isLoading">🔗</span>
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
          </button>
        </div>
        
        <div class="auth-footer">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 32px;
      line-height: 1.5;
    }
    
    .login-options {
      margin-bottom: 32px;
    }
    
    .btn-large {
      width: 100%;
      padding: 16px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    
    .auth-footer {
      text-align: center;
    }
    
    .auth-footer p {
      font-size: 14px;
      color: #999;
      line-height: 1.4;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 16px;
      border-left: 4px solid #c62828;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
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

