import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Manage Your Hobbies</h1>
          <p class="hero-subtitle">
            Track your hobbies, set goals, and connect with like-minded people.
            Start your journey today!
          </p>
          <div class="hero-actions">
            <a routerLink="/login" class="btn btn-primary btn-large">Get Started</a>
            <a routerLink="/dashboard" class="btn btn-secondary btn-large">Dashboard</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose Hobby Manager?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Track Progress</h3>
            <p>Set goals and track your progress in your favorite hobbies.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Connect</h3>
            <p>Find and connect with people who share your interests.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Get insights into your hobby activities and achievements.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
    }
    
    .hero-title {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 24px;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: 40px;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hero-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-large {
      padding: 16px 32px;
      font-size: 18px;
    }
    
    .features-section {
      padding: 80px 0;
      background: white;
    }
    
    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 60px;
      color: #333;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
    }
    
    .feature-card {
      text-align: center;
      padding: 40px 20px;
      border-radius: 12px;
      background: #f8f9fa;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    
    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 16px;
      color: #333;
    }
    
    .feature-card p {
      color: #666;
      line-height: 1.6;
    }
  `]
})
export class HomeComponent {}

