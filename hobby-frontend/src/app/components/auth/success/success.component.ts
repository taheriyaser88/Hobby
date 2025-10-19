import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div *ngIf="isLoading" class="loading-container">
          <div class="spinner"></div>
          <h2>Signing you in...</h2>
          <p>Please wait while we complete your authentication.</p>
        </div>
        
        <div *ngIf="error" class="error-container">
          <h2>Authentication Failed</h2>
          <p>{{ error }}</p>
          <button (click)="goToLogin()" class="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .auth-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }
    
    .loading-container {
      padding: 20px;
    }
    
    .error-container {
      padding: 20px;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    h2 {
      color: #333;
      margin-bottom: 16px;
    }
    
    p {
      color: #666;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-primary {
      background: #667eea;
      color: white;
    }
    
    .btn-primary:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }
  `]
})
export class SuccessComponent implements OnInit {
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (token) {
        // Store the token
        localStorage.setItem('token', token);
        
        // Update auth service
        this.authService.checkAuthStatus();
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      } else {
        this.error = 'No authentication token received';
        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
